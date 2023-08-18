import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import ContentLayout from './Layouts/ContentLayout'
import HeaderLayout from './Layouts/HeaderLayout'
import MainLayout from './Layouts/MainLayout'
import { Box, Button, IconButton, MenuItem, Tooltip, Typography } from '@mui/material'
import BlockchainBookmarkCard from './Cards/BlockchainBookmarkCard'
import BookmarkAddedOutlinedIcon from '@mui/icons-material/BookmarkAddedOutlined';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import AddLinkOutlinedIcon from '@mui/icons-material/AddLinkOutlined';
import AddFolderDialog from './AddFolderDialog';
import { AllBookmarksTypes, TabBookmarksTypes, useAppState } from '../contexts/StateConrext/StateContext';
import BookmarkFolderCard from './Cards/BookmarkFolderCard';
import { useWeb3 } from '../contexts/Web3Context/Web3Context';
import AddCustomBookmarkDialog from './AddCustomBookmarkDialogue';

const CustomBookmarks = () => {
    const [open, setOpen] = useState(false);
    const [openAddBookmark, setOpenAddBookmark] = useState(false)
    const [selectedFolder, setSelectedFolder] = useState("")
    const [view, setView] = useState<"folder" | "bookmarks" | "folder-bookmarks">("folder")
    const [exemptedFolderId, setExemptedFolderId] = useState("")
    const [moveBookmarkId, setMoveBookmarkId] = useState("")
    const [bookmark, setBookmark] = useState<{ id: string, url: string, title: string, folderId: string }>()
    const navigate = useNavigate();

    const { customBookmarks } = useAppState()


    const [showBookmarkBtn, setShowBookmarkBtn] = useState<{
        id: string;
        url: string;
        folderId: string
    }>()
    const [allBookmarks, setAllBookmarks] = useState<AllBookmarksTypes>([]);

    const { createFolder, deleteFolder, updateFolder, addCustomBookmark, deleteBookmark, moveBookmark, updateCustomBookmark, publicAddress, Wallet, getDcryptedString } = useWeb3()



    useEffect(() => {
        if (Wallet) {
            let tempAllBookmarks: AllBookmarksTypes = []
            customBookmarks.forEach((tab: any) => {
                const { bookmarks } = tab
                bookmarks.length > 0 && bookmarks.forEach((bkmrk: any) => {
                    if (bkmrk) {
                        tempAllBookmarks.push(bkmrk)
                    }
                })
            })
            setAllBookmarks(tempAllBookmarks)
        }
    }, [Wallet, customBookmarks])

    const setFolderName = async (folderName: string) => {
        if (folderName) {
            await createFolder("customBookmarks", folderName, "Add Folder")
            setOpen(false)
        }
    }
    const handleAddBookmark = async (folderId: string, title: string, url: string) => {
        if (folderId && url && title && (!exemptedFolderId && !moveBookmarkId)) {
            setOpenAddBookmark(false)
            await addCustomBookmark(folderId, url, title, "Add Custom Bookmark")
        }
    }

    const handleDeleteFolder = async (folderId: string) => {
        if (folderId) {
            await deleteFolder("customBookmarks", folderId, "Delete Folder")
        }
    }
    const handleUpdateFolder = async (folderId: string) => {
        if (folderId) {
            await updateFolder("customBookmarks", folderId, "Update Folder")
        }
    }

    const handleDeleteBookmark = async (folderId: string, bookmarkId: string) => {
        if (folderId && bookmarkId) {
            await deleteBookmark("customBookmarks", folderId, bookmarkId, "Delete Custom Bookmark")
        }
    }

    const handleMove = async (folderId: string) => {
        if (folderId && exemptedFolderId && moveBookmarkId) {
            setOpenAddBookmark(false)
            setExemptedFolderId("");
            setMoveBookmarkId("");
            await moveBookmark("customBookmarks", exemptedFolderId, folderId, moveBookmarkId, "Change Custom Bookmark Folder")
        }
    }

    const handleMoveBookmark = async (fromFolderId: string, bookmarkId: string) => {
        setExemptedFolderId(fromFolderId);
        setMoveBookmarkId(bookmarkId);
        setOpenAddBookmark(true)
    }

    const handleUpdate = (folderId: string, bookmarkId: string) => {
        const folder = customBookmarks.find(fld => fld.folderId === folderId);
        if (folder) {
            const bookmark = folder.bookmarks.find(bkmark => bkmark.id === bookmarkId);
            if (bookmark) {
                setBookmark(bookmark)
                setOpenAddBookmark(true)
            }
        }
    }

    const handleUpdateBookmark = async (id: string, url: string, title: string, folderId: string) => {
        if (bookmark && ((bookmark.title !== title) || (bookmark.url !== url))) {
            await updateCustomBookmark(folderId, id, url, title, "Update Custom Bookmark");
            setBookmark(undefined)
            setOpenAddBookmark(false)
        }
    }

    const handleSelectFolder = (folderId: string) => {
        if (folderId) {
            setSelectedFolder(folderId)
            setView("folder-bookmarks")
        }
    }

    const getFolderName = (folderId: string): string | undefined => {
        let name;
        if (folderId) {
            customBookmarks.find(folder => {
                if (folder.folderId === folderId) {

                    name = folder.name
                }
            })
        }
        return name
    }

    const getView = (viewType: "folder" | "bookmarks" | "folder-bookmarks", customBookmarks: TabBookmarksTypes) => {
        switch (viewType) {
            case "folder":
                return customBookmarks?.map((folder) => {
                    return <BookmarkFolderCard
                        bookmarkFolder={{
                            folderId: folder.folderId,
                            name: folder.name,
                            bookmarksCount: folder?.bookmarks?.length
                        }}
                        deleteFolder={handleDeleteFolder}
                        selectFolder={handleSelectFolder}
                        updateFolder={handleUpdateFolder} />

                })
            case "bookmarks":
                return allBookmarks.map((bookmark) => {
                    return <BlockchainBookmarkCard
                        bookmark={bookmark}
                        showUpdateOpt={true}
                        handlerUpdate={handleUpdate}
                        deleteBookmark={handleDeleteBookmark}
                        moveBookmark={handleMoveBookmark}
                    />

                })
            case "folder-bookmarks":
                return customBookmarks?.map((folder) => {
                    if (folder.folderId === selectedFolder) {
                        const { bookmarks } = folder
                        return bookmarks.map((bookmark) => {
                            return <BlockchainBookmarkCard
                                bookmark={bookmark}
                                showUpdateOpt={true}
                                handlerUpdate={handleUpdate}
                                deleteBookmark={handleDeleteBookmark}
                                moveBookmark={handleMoveBookmark}
                            />

                        });
                    }
                })
            default:
                return null
        }
    }



    return (
        <MainLayout>
            <HeaderLayout>
                <Typography component="h1" variant="h5">
                    Custom Bookmarks
                </Typography>
            </HeaderLayout>
            {
                (publicAddress && Wallet) ?
                    <ContentLayout>
                        <div style={{ display: 'flex', width: '100%', justifyContent: "space-between", alignItems: 'center' }}>

                            {selectedFolder && view === "folder-bookmarks" ?
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <IconButton onClick={() => setView("folder")} sx={{ marginRight: "4px" }} size='medium'>
                                        <ArrowBackIosNewOutlinedIcon sx={{ fontSize: "1rem" }} />
                                    </IconButton>
                                    <MenuItem sx={{ minHeight: "22px", height: "max-content", padding: "4px 6px", borderRadius: "6px", marginRight: "4px", backgroundImage: view === 'folder-bookmarks' ? `linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))` : 'none' }} >{getFolderName(selectedFolder)}</MenuItem>
                                </Box> :
                                <Box sx={{ display: "flex" }}>
                                    <MenuItem onClick={() => setView("folder")} sx={{ minHeight: "22px", height: "max-content", padding: "4px 6px", borderRadius: "6px", marginRight: "4px", backgroundImage: view === 'folder' ? `linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))` : 'none' }} >Folders</MenuItem>
                                    <MenuItem onClick={() => setView("bookmarks")} sx={{ minHeight: "22px", height: "max-content", padding: "4px 6px", borderRadius: "6px", marginRight: "4px", backgroundImage: view === 'bookmarks' ? `linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))` : 'none' }}>All Bookmarks</MenuItem>
                                </Box>
                            }

                            <Box>
                                {
                                    showBookmarkBtn ?
                                        <Tooltip title={`This page is already bookmarked, ${showBookmarkBtn?.url}`}>
                                            <IconButton>
                                                <BookmarkAddedOutlinedIcon />
                                            </IconButton>
                                        </Tooltip>
                                        :
                                        <Tooltip title={`Add Bookmark`}>
                                            <IconButton onClick={() => setOpenAddBookmark(true)}>
                                                <AddLinkOutlinedIcon />
                                            </IconButton>
                                        </Tooltip>
                                }
                                <Tooltip title={`Add new folder`}>
                                    <IconButton onClick={() => setOpen(true)}>
                                        <CreateNewFolderOutlinedIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>

                        </div>
                        {

                            getView(view, customBookmarks)
                        }
                        {
                            open && <AddFolderDialog handleClose={() => setOpen(false)} handleAdd={setFolderName} title='Folder'/>
                        }
                        {
                            openAddBookmark && <AddCustomBookmarkDialog handleClose={() => setOpenAddBookmark(false)}
                                handleAdd={handleAddBookmark} handleMove={handleMove} bookmark={bookmark} handleUpdate={handleUpdateBookmark} exemptFolderId={exemptedFolderId} handleShowFolder={() => { setOpen(true); setOpenAddBookmark(false) }} />
                        }

                    </ContentLayout> :
                    <Box sx={{ display: 'flex', width: '100%', justifyContent: "center", alignItems: 'center', flexDirection: "column", height: "70%" }}>
                        <Typography component="h1" variant="h6">
                            Please connect Wallet to use this Feature!
                        </Typography>
                        <Button
                            onClick={() => navigate('/')}
                            variant="outlined"
                            sx={{ marginTop: "26px", padding: "0", width: '60%' }}
                        >
                            CONNECT WALLET
                        </Button>
                    </Box>
            }


        </MainLayout>
    )
}

export default CustomBookmarks;