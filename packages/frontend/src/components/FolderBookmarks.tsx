import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import ContentLayout from './Layouts/ContentLayout'
import HeaderLayout from './Layouts/HeaderLayout'
import MainLayout from './Layouts/MainLayout'
import { Button, IconButton, Typography } from '@mui/material'
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import { useAppState } from '../contexts/StateConrext/StateContext'
import BlockchainBookmarkCard from './Cards/BlockchainBookmarkCard'
import AddBookmarkDialog from './AddBookmarkDialog'
import AddFolderDialog from './AddFolderDialog'


const FolderBookmarks = () => {
    let { folderId = '0' } = useParams();
    const { tabBookmarks } = useAppState();
    const [open, setOpen] = useState(false);
    const [openAddBookmark, setOpenAddBookmark] = useState(false)
    const folderBookmarks = tabBookmarks.find(bookmark => bookmark.folderId ===  folderId)
    console.log("folderBookmarks", folderBookmarks)
    return (
        <MainLayout>
            <HeaderLayout>
                <Typography component="h1" variant="h5">
                    Blockchain Bookmarks
                </Typography>
            </HeaderLayout>
            <ContentLayout>
                <div style={{ display: 'flex', width: '100%' }}>
                    <IconButton onClick={() => setOpenAddBookmark(true)}>
                        <BookmarkAddOutlinedIcon />
                    </IconButton>
                    <IconButton onClick={() => setOpen(true)}>
                        <CreateNewFolderOutlinedIcon />
                    </IconButton>
                </div>
                {
                    // folderBookmarks?.bookmarks.map((bookmark) => {
                    //     return <BlockchainBookmarkCard bookmark={bookmark} />

                    // })
                }
                {/* {
                    open && <AddFolderDialog handleClose={() => setOpen(false)} handleAdd={setFolderName} />
                }
                {
                    openAddBookmark && <AddBookmarkDialog handleClose={() => setOpenAddBookmark(false)}
                        handleAdd={handleAddBookmark} />
                } */}

            </ContentLayout>
        </MainLayout>
    )
}

export default FolderBookmarks