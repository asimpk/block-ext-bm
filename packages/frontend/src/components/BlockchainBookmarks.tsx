import { useEffect, useState } from 'react'
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import ContentLayout from './Layouts/ContentLayout'
import HeaderLayout from './Layouts/HeaderLayout'
import MainLayout from './Layouts/MainLayout'
import { Box, IconButton, MenuItem, Typography } from '@mui/material'
import BlockchainBookmarkCard from './Cards/BlockchainBookmarkCard'
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
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
    const [view, setView] = useState<"folder" | "bookmarks" | "folder-bookmarks">("folder")
    const { tabBookmarks, allBookmarks } = useAppState()
    const { activeTab } = useAddBookmarkBtn()
    const { createFolder, deleteFolder, updateFolder, addBookmark } = useWeb3()



    // useEffect(() => {
    //     chrome.storage.local.get({ bookmarks: [] }).then(result => {
    //         const bookmarks = result.bookmarks;
    //         setBookmarks(bookmarks)
    //     })
    // }, [])

    const setFolderName = async (folderName: string) => {
        if (folderName) {
            await createFolder(folderName)
            setOpen(false)
        }
    }
    const handleAddBookmark = async (folderId: string) => {
        if (folderId && activeTab) {
            setOpenAddBookmark(false)
            await addBookmark(folderId, activeTab.url)
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
                        bookmarkFolder={{ folderId: folder.folderId, name: folder.name, bookmarksCount: folder.bookmarks.length }}
                        deleteFolder={handleDeleteFolder}
                        selectFolder={handleSelectFolder}
                        updateFolder={handleUpdateFolder} />

                })
            case "bookmarks":
                return allBookmarks.map((bookmark) => {
                    return <BlockchainBookmarkCard bookmark={bookmark} />

                })
            case "folder-bookmarks":
                return tabBookmarks?.map((folder) => {
                    if (folder.folderId === selectedFolder) {
                        const { bookmarks } = folder
                        return bookmarks.map((bookmark) => {
                            return <BlockchainBookmarkCard bookmark={bookmark} />

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
                    Blockchain Bookmarks
                </Typography>
            </HeaderLayout>
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
                        <IconButton onClick={() => setOpenAddBookmark(true)}>
                            <BookmarkAddOutlinedIcon />
                        </IconButton>
                        <IconButton onClick={() => setOpen(true)}>
                            <CreateNewFolderOutlinedIcon />
                        </IconButton>
                    </Box>

                </div>
                {

                    getView(view)
                }
                {
                    open && <AddFolderDialog handleClose={() => setOpen(false)} handleAdd={setFolderName} />
                }


            </ContentLayout>
            {
                openAddBookmark && <AddBookmarkDialog handleClose={() => setOpenAddBookmark(false)}
                    handleAdd={handleAddBookmark} />
            }
        </MainLayout>
    )
}

export default BlockchainBookmarks