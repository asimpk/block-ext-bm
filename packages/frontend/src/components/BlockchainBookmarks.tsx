import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import ContentLayout from './Layouts/ContentLayout'
import HeaderLayout from './Layouts/HeaderLayout'
import MainLayout from './Layouts/MainLayout'
import { Box, Button, IconButton, MenuItem, Tooltip, Typography } from '@mui/material'
import BlockchainBookmarkCard from './Cards/BlockchainBookmarkCard'
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import BookmarkAddedOutlinedIcon from '@mui/icons-material/BookmarkAddedOutlined';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import AddFolderDialog from './AddFolderDialog';
import AddBookmarkDialog from './AddBookmarkDialog';
import { useAppState } from '../contexts/StateConrext/StateContext';
import BookmarkFolderCard from './Cards/BookmarkFolderCard';
import { useWeb3 } from '../contexts/Web3Context/Web3Context';
import useAddBookmarkBtn from '../hooks/useAddBookmarkBtn';

const BlockchainBookmarks = () => {
    const [open, setOpen] = useState(false);
    const [openAddBookmark, setOpenAddBookmark] = useState(false)
    const [selectedFolder, setSelectedFolder] = useState("")
    const navigate = useNavigate();
    const [view, setView] = useState<"folder" | "bookmarks" | "folder-bookmarks">("folder")
    const [exemptedFolderId, setExemptedFolderId] = useState("")
    const [moveBookmarkId, setMoveBookmarkId] = useState("")
    const { tabBookmarks, allBookmarks } = useAppState()
    const { activeTab } = useAddBookmarkBtn();

    const { createFolder, deleteFolder, updateFolder, addBookmark, deleteBookmark, moveBookmark, publicAddress, Wallet } = useWeb3()

    const showBookmarkBtn = allBookmarks.find(bookmark => bookmark.url === activeTab?.url)

    const setFolderName = async (folderName: string) => {
        if (folderName) {
            await createFolder(folderName)
            setOpen(false)
        }
    }
    const handleAddBookmark = async (folderId: string) => {
        if (folderId && activeTab && (!exemptedFolderId && !moveBookmarkId)) {
            setOpenAddBookmark(false)
            await addBookmark(folderId, activeTab.url)
        } else if (folderId && exemptedFolderId && moveBookmarkId) {
            setOpenAddBookmark(false)
            setExemptedFolderId("");
            setMoveBookmarkId("");
            await moveBookmark(exemptedFolderId, folderId, moveBookmarkId)
        }
    }

    const handleDeleteFolder = async (folderId: string) => {
        if (folderId) {
            await deleteFolder(folderId)
        }
    }
    const handleUpdateFolder = async (folderId: string) => {
        if (folderId) {
            await updateFolder(folderId)
        }
    }

    const handleDeleteBookmark = async (folderId: string, bookmarkId: string) => {
        if (folderId && bookmarkId) {
            await deleteBookmark(folderId, bookmarkId)
        }
    }

    const handleMoveBookmark = async (fromFolderId: string, bookmarkId: string) => {
        setExemptedFolderId(fromFolderId);
        setMoveBookmarkId(bookmarkId);
        setOpenAddBookmark(true)
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
            tabBookmarks.find(folder => {
                if (folder.folderId === folderId) {

                    name = folder.name
                }
            })
        }
        return name
    }
    const getView = (viewType: "folder" | "bookmarks" | "folder-bookmarks") => {
        switch (viewType) {
            case "folder":
                return tabBookmarks?.map((folder) => {
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
                        deleteBookmark={handleDeleteBookmark}
                        moveBookmark={handleMoveBookmark}
                    />

                })
            case "folder-bookmarks":
                return tabBookmarks?.map((folder) => {
                    if (folder.folderId === selectedFolder) {
                        const { bookmarks } = folder
                        return bookmarks.map((bookmark) => {
                            return <BlockchainBookmarkCard
                                bookmark={bookmark}
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
                    Bookmarks
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
                                        <Tooltip title={`This page is already bookmarked, click to view, ${showBookmarkBtn?.url}`}>
                                            <IconButton onClick={() => window.open(showBookmarkBtn?.url, '_blank')}>
                                                <BookmarkAddedOutlinedIcon />
                                            </IconButton>
                                        </Tooltip>
                                        :
                                        <Tooltip title={`Add Bookmark`}>
                                            <IconButton onClick={() => setOpenAddBookmark(true)}>
                                                <BookmarkAddOutlinedIcon />
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

                            getView(view)
                        }
                        {
                            open && <AddFolderDialog handleClose={() => setOpen(false)} handleAdd={setFolderName} />
                        }
                        {
                            openAddBookmark && <AddBookmarkDialog handleClose={() => setOpenAddBookmark(false)}
                                handleAdd={handleAddBookmark} exemptFolderId={exemptedFolderId} handleShowFolder={() => { setOpen(true); setOpenAddBookmark(false)}} />
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

export default BlockchainBookmarks