import React, { useEffect, useRef, useState } from "react";
import { AllBookmarksTypes, CustomBookmarksTypes, StateContext, TabBookmarksTypes, PersonalNotesTypes } from "./StateContext"
import { Wallet, ethers } from "ethers";
import EthCrypto from 'eth-crypto';
import { ContractName, useWeb3 } from "../Web3Context/Web3Context";
import useAddBookmarkBtn from '../../hooks/useAddBookmarkBtn';

export const StateProvider: React.FC<{ children: any }> = ({ children }) => {
    const { Wallet, contractInstances, getDcryptedString } = useWeb3();
    const { activeTab } = useAddBookmarkBtn();
    const [tabBookmarks, setTabBookmarks] = useState<TabBookmarksTypes>([]);
    const [customBookmarks, setCustomBookmarks] = useState<CustomBookmarksTypes>([]);
    const [personalNotes, setPersonalNotes] = useState<PersonalNotesTypes>([]);
    const tabBookmarksRef = useRef<TabBookmarksTypes>([]);
    const customBookmarksRef = useRef<CustomBookmarksTypes>([]);
    const personalNotesRef = useRef<PersonalNotesTypes>([]);

    // const [allBookmarks, setAllBookmarks] = useState<AllBookmarksTypes>([])

    const getState = async (contracts: { [k in ContractName]: ethers.Contract }): Promise<{ tabBookmarksByFolder: TabBookmarksTypes, customBookmarksByFolder: CustomBookmarksTypes, personalNotesByFolder: PersonalNotesTypes }> => {
        if (Wallet) {
            const tabBookmarks = contracts['tabBookmarks'];
            const customBookmarks = contracts['customBookmarks'];
            const personalNotes = contracts['personalNotes']
            const allTabBookmarks = await tabBookmarks.getAllFolders();
            const allCustomBookmarks = await customBookmarks.getAllFolders();
            const allPersonalNotes = await personalNotes.getAllFolders();

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

            const parsedPersonalNotes: PersonalNotesTypes = await Promise.all(allPersonalNotes.map(async (notesInfo: any) => {
                const notes = await personalNotes.getNotesByFolder(notesInfo.folderId);
                // const { bookmarks } = bookmarkInfo
                const parsedNotes = await Promise.all(notes.map(async (note: any) => {
                    const dcryptedTitleDecompressed = EthCrypto.util.removeLeading0x(EthCrypto.hex.decompress(note.title, true));
                    const dcryptedDescriptionDecompressed = EthCrypto.util.removeLeading0x(EthCrypto.hex.decompress(note.description, true));
                    const dcryptedTitle = await getDcryptedString(Wallet, dcryptedTitleDecompressed);
                    const dcryptedDescription = await getDcryptedString(Wallet, dcryptedDescriptionDecompressed);
                    return { id: ethers.utils.parseBytes32String(note.noteId), title: dcryptedTitle, description: dcryptedDescription, folderId: ethers.utils.parseBytes32String(notesInfo.folderId) }
                }))
                const dcryptedFolderNameDecompressed = EthCrypto.util.removeLeading0x(EthCrypto.hex.decompress(notesInfo.name, true))
                const dcryptedFolderName = await getDcryptedString(Wallet, dcryptedFolderNameDecompressed)
                return {
                    folderId: ethers.utils.parseBytes32String(notesInfo.folderId),
                    name: dcryptedFolderName,
                    color: ethers.utils.parseBytes32String(notesInfo.color),
                    notes: parsedNotes
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
            return { tabBookmarksByFolder: parsedTabBookmarks, customBookmarksByFolder:  parsedCustomBookmarks, personalNotesByFolder: parsedPersonalNotes}
        }
        return { tabBookmarksByFolder: [], customBookmarksByFolder: [], personalNotesByFolder: [] }
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
                const { tabBookmarksByFolder, customBookmarksByFolder, personalNotesByFolder } = await getState(contractInstances)
                if (!areArraysDeepEqual(tabBookmarksRef.current, tabBookmarksByFolder)) {
                    tabBookmarksRef.current = tabBookmarksByFolder; // Update the mutable reference
                    setTabBookmarks(tabBookmarksByFolder);
                }
                if (!areArraysDeepEqual(customBookmarksRef.current, customBookmarksByFolder)) {
                    customBookmarksRef.current = customBookmarksByFolder; // Update the mutable reference
                    setCustomBookmarks(customBookmarksByFolder);
                }
                if (!areArraysDeepEqual(personalNotesRef.current, personalNotesByFolder)) {
                    personalNotesRef.current = personalNotesByFolder; // Update the mutable reference
                    setPersonalNotes(personalNotesByFolder);
                }
            };
            Wallet.provider.on("block", blockListener);

        } else if (!Wallet) {
            setTabBookmarks([]);
            setCustomBookmarks([]);
            setPersonalNotes([]);
            tabBookmarksRef.current = [];
            customBookmarksRef.current = [];
            personalNotesRef.current = []

        }
    }, [contractInstances, Wallet?.address, activeTab])


    const provider = {
        tabBookmarks,
        customBookmarks,
        personalNotes
    }

    return <StateContext.Provider value={provider}>{children}</StateContext.Provider>;
};

