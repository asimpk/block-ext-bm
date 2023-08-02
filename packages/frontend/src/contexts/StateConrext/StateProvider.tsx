// import React, { useEffect, useRef, useState } from "react";
// import { AllBookmarksTypes, StateContext, TabBookmarksTypes } from "./StateContext"
// import { Wallet, ethers } from "ethers";
// import EthCrypto from 'eth-crypto';
// import { useWeb3 } from "../Web3Context/Web3Context";
// import useAddBookmarkBtn from '../../hooks/useAddBookmarkBtn';

// export const StateProvider: React.FC<{ children: any }> = ({ children }) => {
//     const { Wallet, contractInstances, getDcryptedString } = useWeb3()
//     const { activeTab } = useAddBookmarkBtn();
//     const [tabBookmarks, setTabBookmarks] = useState<TabBookmarksTypes>([])
//     const tabBookmarksRef = useRef<TabBookmarksTypes>([]);

//     // const [allBookmarks, setAllBookmarks] = useState<AllBookmarksTypes>([])

//     const getState = async (contracts: ethers.Contract[] | []): Promise<{ bookmarksByFolder: TabBookmarksTypes }> => {
//         if (Wallet) {
//             const tabBookmarks = contracts[0]
//             const allTabBookmarks = await tabBookmarks.getAllFoldersBookmarks()

//             const parsedTabBookmarks: TabBookmarksTypes = await Promise.all(allTabBookmarks.map(async (bookmarkInfo: any) => {
//                 const { bookmarks } = bookmarkInfo
//                 const parsedBookMarks = await Promise.all(bookmarks.map(async (bkmrk: any) => {
//                     const dcryptedUrlDecompressed = EthCrypto.util.removeLeading0x(EthCrypto.hex.decompress(bkmrk.url, true))
//                     const dcryptedUrl = await getDcryptedString(Wallet, dcryptedUrlDecompressed)
//                     return { id: ethers.utils.parseBytes32String(bkmrk.bookmarkId), url: dcryptedUrl, folderId: ethers.utils.parseBytes32String(bookmarkInfo.folderId) }
//                 }))
//                 const dcryptedFolderNameDecompressed = EthCrypto.util.removeLeading0x(EthCrypto.hex.decompress(bookmarkInfo.name, true))
//                 const dcryptedFolderName = await getDcryptedString(Wallet, dcryptedFolderNameDecompressed)
//                 return {
//                     folderId: ethers.utils.parseBytes32String(bookmarkInfo.folderId),
//                     name: dcryptedFolderName,
//                     color: ethers.utils.parseBytes32String(bookmarkInfo.color),
//                     bookmarks: parsedBookMarks
//                 };
//             }));

//             // let tempAllBookmarks: AllBookmarksTypes = []
//             // allTabBookmarks.forEach((tab: any) => {
//             //     const { bookmarks } = tab
//             //     bookmarks.forEach(async (bkmrk: any) => {
//             //         const dcryptedUrlDecompressed = EthCrypto.util.removeLeading0x(EthCrypto.hex.decompress(bkmrk.url, true))
//             //         const dcryptedUrl = await getDcryptedString(Wallet, dcryptedUrlDecompressed)
//             //         tempAllBookmarks.push({ id: ethers.utils.parseBytes32String(bkmrk.bookmarkId), url: dcryptedUrl, folderId: ethers.utils.parseBytes32String(tab.folderId) })
//             //     })

//             // });
//             return { bookmarksByFolder: parsedTabBookmarks }
//         }
//         return { bookmarksByFolder: [] }
//     }


//     function deepEqual(obj1: any, obj2: any): boolean {
//         // Check if the objects are of the same type
//         if (typeof obj1 !== typeof obj2) return false;

//         // If they are not objects or null, compare them directly
//         if (typeof obj1 !== "object" || obj1 === null) return obj1 === obj2;

//         // Get the keys of both objects
//         const keys1 = Object.keys(obj1);
//         const keys2 = Object.keys(obj2);

//         // Check if they have the same number of properties
//         if (keys1.length !== keys2.length) return false;

//         // Check if each property is deeply equal
//         for (const key of keys1) {
//             if (!deepEqual(obj1[key], obj2[key])) return false;
//         }

//         return true;
//     }

//     // Function to check deep equality of arrays
//     function areArraysDeepEqual(arr1: any[], arr2: any[]): boolean {
//         // Check if they are arrays
//         if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;

//         // Check if they have the same length
//         if (arr1.length !== arr2.length) return false;

//         // Check if each element is deeply equal
//         for (let i = 0; i < arr1.length; i++) {
//             if (!deepEqual(arr1[i], arr2[i])) return false;
//         }

//         return true;
//     }



//     useEffect(() => {
//         if (contractInstances && Wallet) {
//             const blockListener = async (blockTag: number) => {
//                 const { bookmarksByFolder } = await getState(contractInstances)

//                 if (!areArraysDeepEqual(tabBookmarksRef.current, bookmarksByFolder)) {

//                     tabBookmarksRef.current = bookmarksByFolder; // Update the mutable reference

//                     setTabBookmarks(bookmarksByFolder);
//                 }
//             };
//             Wallet.provider.on("block", blockListener);

//         } else if (!Wallet) {
//             setTabBookmarks([])
//             // setAllBookmarks([])
//         }
//     }, [contractInstances, Wallet?.address, activeTab])


//     const provider = {
//         tabBookmarks
//         // allBookmarks
//     }

//     return <StateContext.Provider value={provider}>{children}</StateContext.Provider>;
// };

import React, { useEffect, useRef, useState } from "react";
import { AllBookmarksTypes, CustomBookmarksTypes, StateContext, TabBookmarksTypes } from "./StateContext"
import { Wallet, ethers } from "ethers";
import EthCrypto from 'eth-crypto';
import { ContractName, useWeb3 } from "../Web3Context/Web3Context";
import useAddBookmarkBtn from '../../hooks/useAddBookmarkBtn';

export const StateProvider: React.FC<{ children: any }> = ({ children }) => {
    const { Wallet, contractInstances, getDcryptedString } = useWeb3();
    const { activeTab } = useAddBookmarkBtn();
    const [tabBookmarks, setTabBookmarks] = useState<TabBookmarksTypes>([]);
    const [customBookmarks, setCustomBookmarks] = useState<CustomBookmarksTypes>([]);
    const tabBookmarksRef = useRef<TabBookmarksTypes>([]);
    const customBookmarksRef = useRef<CustomBookmarksTypes>([]);

    // const [allBookmarks, setAllBookmarks] = useState<AllBookmarksTypes>([])

    const getState = async (contracts: { [k in ContractName]: ethers.Contract }): Promise<{ tabBookmarksByFolder: TabBookmarksTypes, customBookmarksByFolder: CustomBookmarksTypes }> => {
        if (Wallet) {
            const tabBookmarks = contracts['tabBookmarks'];
            const customBookmarks = contracts['customBookmarks'];
            const allTabBookmarks = await tabBookmarks.getAllFolders();
            const allCustomBookmarks = await customBookmarks.getAllFolders();

            const parsedTabBookmarks: TabBookmarksTypes = await Promise.all(allTabBookmarks.map(async (bookmarkInfo: any) => {
                const bookmarks = await tabBookmarks.getBookmarksByFolder(bookmarkInfo.folderId);
                // const { bookmarks } = bookmarkInfo
                const parsedBookMarks = await Promise.all(bookmarks.map(async (bkmrk: any) => {
                    const dcryptedUrlDecompressed = EthCrypto.util.removeLeading0x(EthCrypto.hex.decompress(bkmrk.url, true))
                    const dcryptedUrl = await getDcryptedString(Wallet, dcryptedUrlDecompressed)
                    return { id: ethers.utils.parseBytes32String(bkmrk.bookmarkId), url: dcryptedUrl, folderId: ethers.utils.parseBytes32String(bookmarkInfo.folderId) }
                }))
                const dcryptedFolderNameDecompressed = EthCrypto.util.removeLeading0x(EthCrypto.hex.decompress(bookmarkInfo.name, true))
                const dcryptedFolderName = await getDcryptedString(Wallet, dcryptedFolderNameDecompressed)
                return {
                    folderId: ethers.utils.parseBytes32String(bookmarkInfo.folderId),
                    name: dcryptedFolderName,
                    color: ethers.utils.parseBytes32String(bookmarkInfo.color),
                    bookmarks: parsedBookMarks
                };
            }));


            const parsedCustomBookmarks: CustomBookmarksTypes = await Promise.all(allCustomBookmarks.map(async (bookmarkInfo: any) => {
                const bookmarks = await customBookmarks.getBookmarksByFolder(bookmarkInfo.folderId);
                // const { bookmarks } = bookmarkInfo
                const parsedBookMarks = await Promise.all(bookmarks.map(async (bkmrk: any) => {
                    const dcryptedUrlDecompressed = EthCrypto.util.removeLeading0x(EthCrypto.hex.decompress(bkmrk.url, true));
                    const dcryptedTitleDecompressed = EthCrypto.util.removeLeading0x(EthCrypto.hex.decompress(bkmrk.title, true));
                    const dcryptedUrl = await getDcryptedString(Wallet, dcryptedUrlDecompressed);
                    const dcryptedTitle = await getDcryptedString(Wallet, dcryptedTitleDecompressed);
                    return { id: ethers.utils.parseBytes32String(bkmrk.bookmarkId), url: dcryptedUrl, title: dcryptedTitle, folderId: ethers.utils.parseBytes32String(bookmarkInfo.folderId) }
                }))
                const dcryptedFolderNameDecompressed = EthCrypto.util.removeLeading0x(EthCrypto.hex.decompress(bookmarkInfo.name, true))
                const dcryptedFolderName = await getDcryptedString(Wallet, dcryptedFolderNameDecompressed)
                return {
                    folderId: ethers.utils.parseBytes32String(bookmarkInfo.folderId),
                    name: dcryptedFolderName,
                    color: ethers.utils.parseBytes32String(bookmarkInfo.color),
                    bookmarks: parsedBookMarks
                };
            }));

            // let tempAllBookmarks: AllBookmarksTypes = []
            // allTabBookmarks.forEach((tab: any) => {
            //     const { bookmarks } = tab
            //     bookmarks.forEach(async (bkmrk: any) => {
            //         const dcryptedUrlDecompressed = EthCrypto.util.removeLeading0x(EthCrypto.hex.decompress(bkmrk.url, true))
            //         const dcryptedUrl = await getDcryptedString(Wallet, dcryptedUrlDecompressed)
            //         tempAllBookmarks.push({ id: ethers.utils.parseBytes32String(bkmrk.bookmarkId), url: dcryptedUrl, folderId: ethers.utils.parseBytes32String(tab.folderId) })
            //     })

            // });
            return { tabBookmarksByFolder: parsedTabBookmarks, customBookmarksByFolder:  parsedCustomBookmarks}
        }
        return { tabBookmarksByFolder: [], customBookmarksByFolder: [] }
    }


    function deepEqual(obj1: any, obj2: any): boolean {
        // Check if the objects are of the same type
        if (typeof obj1 !== typeof obj2) return false;

        // If they are not objects or null, compare them directly
        if (typeof obj1 !== "object" || obj1 === null) return obj1 === obj2;

        // Get the keys of both objects
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        // Check if they have the same number of properties
        if (keys1.length !== keys2.length) return false;

        // Check if each property is deeply equal
        for (const key of keys1) {
            if (!deepEqual(obj1[key], obj2[key])) return false;
        }

        return true;
    }

    // Function to check deep equality of arrays
    function areArraysDeepEqual(arr1: any[], arr2: any[]): boolean {
        // Check if they are arrays
        if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;

        // Check if they have the same length
        if (arr1.length !== arr2.length) return false;

        // Check if each element is deeply equal
        for (let i = 0; i < arr1.length; i++) {
            if (!deepEqual(arr1[i], arr2[i])) return false;
        }

        return true;
    }



    useEffect(() => {
        if (contractInstances && Wallet) {
            const blockListener = async (blockTag: number) => {
                const { tabBookmarksByFolder, customBookmarksByFolder } = await getState(contractInstances)
                if (!areArraysDeepEqual(tabBookmarksRef.current, tabBookmarksByFolder)) {
                    tabBookmarksRef.current = tabBookmarksByFolder; // Update the mutable reference
                    setTabBookmarks(tabBookmarksByFolder);
                }
                if (!areArraysDeepEqual(customBookmarksRef.current, customBookmarksByFolder)) {
                    customBookmarksRef.current = customBookmarksByFolder; // Update the mutable reference
                    setCustomBookmarks(customBookmarksByFolder);
                }
            };
            Wallet.provider.on("block", blockListener);

        } else if (!Wallet) {
            setTabBookmarks([]);
            setCustomBookmarks([]);
            tabBookmarksRef.current = []
            customBookmarksRef.current = []
        }
    }, [contractInstances, Wallet?.address, activeTab])


    const provider = {
        tabBookmarks,
        customBookmarks
    }

    return <StateContext.Provider value={provider}>{children}</StateContext.Provider>;
};

