import React, { useEffect, useState } from "react";
import { AllBookmarksTypes, StateContext, TabBookmarksTypes } from "./StateContext"
import { ethers } from "ethers";
import { useWeb3 } from "../Web3Context/Web3Context";

export const StateProvider: React.FC<{ children: any }> = ({ children }) => {
    const { Wallet, contractInstances } = useWeb3()
    const [tabBookmarks, setTabBookmarks] = useState<TabBookmarksTypes>([])
    const [allBookmarks, setAllBookmarks] = useState<AllBookmarksTypes>([])

    const getState = async (contracts: ethers.Contract[] | []): Promise<{bookmarksByFolder: TabBookmarksTypes, allBookmarks: AllBookmarksTypes}> => {
        const tabBookmarks = contracts[0]
        const allTabBookmarks = await tabBookmarks.getAllFoldersBookmarks()

        const parsedTabBookmarks: TabBookmarksTypes = allTabBookmarks.map((bookmarkInfo: any) => {
            const { bookmarks } = bookmarkInfo
            const parsedBookMarks = bookmarks.map((bkmrk: any) => {
                return { id: ethers.utils.parseBytes32String(bkmrk.bookmarkId), url: bkmrk.url, folderId: ethers.utils.parseBytes32String(bookmarkInfo.folderId) }
            })
            return {
                folderId: ethers.utils.parseBytes32String(bookmarkInfo.folderId),
                name: ethers.utils.parseBytes32String(bookmarkInfo.name),
                color: ethers.utils.parseBytes32String(bookmarkInfo.color),
                bookmarks: parsedBookMarks
            };
        });

        let tempAllBookmarks : AllBookmarksTypes = []
        allTabBookmarks.forEach((tab: any) => {
            const { bookmarks } = tab
            bookmarks.forEach((bkmrk: any) => {
                tempAllBookmarks.push({ id: ethers.utils.parseBytes32String(bkmrk.bookmarkId), url: bkmrk.url, folderId: ethers.utils.parseBytes32String(tab.folderId) })
            })
        
        });
        return {bookmarksByFolder: parsedTabBookmarks, allBookmarks: tempAllBookmarks}
    }



    useEffect(() => {
        if (contractInstances && Wallet) {
            const blockListener = async (blockTag: number) => {
                const { bookmarksByFolder, allBookmarks  } = await getState(contractInstances)
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
