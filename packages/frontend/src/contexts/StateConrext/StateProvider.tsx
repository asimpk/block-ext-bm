import React, { useEffect, useState } from "react";
import { AllBookmarksTypes, StateContext, TabBookmarksTypes } from "./StateContext"
import { Wallet, ethers } from "ethers";
import EthCrypto from 'eth-crypto';
import { useWeb3 } from "../Web3Context/Web3Context";

export const StateProvider: React.FC<{ children: any }> = ({ children }) => {
    const { Wallet, contractInstances, getDcryptedString } = useWeb3()
    const [tabBookmarks, setTabBookmarks] = useState<TabBookmarksTypes>([])
    const [allBookmarks, setAllBookmarks] = useState<AllBookmarksTypes>([])

    const getState = async (contracts: ethers.Contract[] | [], wallet: Wallet): Promise<{bookmarksByFolder: TabBookmarksTypes, allBookmarks: AllBookmarksTypes}> => {
        const tabBookmarks = contracts[0]
        const allTabBookmarks = await tabBookmarks.getAllFoldersBookmarks()

        const parsedTabBookmarks: TabBookmarksTypes =  await  Promise.all(allTabBookmarks.map(async (bookmarkInfo: any) => {
            const { bookmarks } = bookmarkInfo
            const parsedBookMarks = await  Promise.all(bookmarks.map(async (bkmrk: any) => {
                const dcryptedUrlDecompressed = EthCrypto.util.removeLeading0x(EthCrypto.hex.decompress(bkmrk.url, true))
                const dcryptedUrl = await getDcryptedString(wallet, dcryptedUrlDecompressed)
                return { id: ethers.utils.parseBytes32String(bkmrk.bookmarkId), url: dcryptedUrl, folderId: ethers.utils.parseBytes32String(bookmarkInfo.folderId) }
            }))
            const dcryptedFolderNameDecompressed = EthCrypto.util.removeLeading0x(EthCrypto.hex.decompress(bookmarkInfo.name, true))
            const dcryptedFolderName = await getDcryptedString(wallet, dcryptedFolderNameDecompressed)
            return {
                folderId: ethers.utils.parseBytes32String(bookmarkInfo.folderId),
                name:  dcryptedFolderName,
                color: ethers.utils.parseBytes32String(bookmarkInfo.color),
                bookmarks: parsedBookMarks
            };
        }));

        let tempAllBookmarks : AllBookmarksTypes = []
        allTabBookmarks.forEach((tab: any) => {
            const { bookmarks } = tab
            bookmarks.forEach(async (bkmrk: any) => {
                const dcryptedUrlDecompressed = EthCrypto.util.removeLeading0x(EthCrypto.hex.decompress(bkmrk.url, true))
                const dcryptedUrl = await getDcryptedString(wallet, dcryptedUrlDecompressed)
                tempAllBookmarks.push({ id: ethers.utils.parseBytes32String(bkmrk.bookmarkId), url: dcryptedUrl, folderId: ethers.utils.parseBytes32String(tab.folderId) })
            })
        
        });
        return {bookmarksByFolder: parsedTabBookmarks, allBookmarks: tempAllBookmarks}
    }



    useEffect(() => {
        if (contractInstances && Wallet) {
            const blockListener = async (blockTag: number) => {
                const { bookmarksByFolder, allBookmarks  } = await getState(contractInstances, Wallet)
                setTabBookmarks(bookmarksByFolder)
                setAllBookmarks(allBookmarks)

            };
            Wallet.provider.on("block", blockListener);
            
        } else if (!Wallet) {
            setTabBookmarks([])
        }
    }, [contractInstances, Wallet])


    const provider = {
        tabBookmarks,
        allBookmarks
    }

    return <StateContext.Provider value={provider}>{children}</StateContext.Provider>;
};
