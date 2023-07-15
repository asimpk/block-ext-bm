import React, { useEffect, useState } from 'react'
import ContentLayout from './Layouts/ContentLayout'
import HeaderLayout from './Layouts/HeaderLayout'
import MainLayout from './Layouts/MainLayout'
import { Typography } from '@mui/material'
import BlockchainBookmarkCard from './Cards/BlockchainBookmarkCard'

const CommunityBookmarks = () => {
    const [bookmarks, setBookmarks] = useState<{ id: number, url: string, title: string }[]>([])

    useEffect(() => {
        chrome.storage.local.get({ bookmarks: [] }).then(result => {
            const bookmarks = result.bookmarks;
            setBookmarks(bookmarks)
        })
    }, [])
    return (
        <MainLayout>
            <HeaderLayout>
                <Typography component="h1" variant="h5">
                    Community Bookmarks
                </Typography>
            </HeaderLayout>
            <ContentLayout>
                {/* {
                    bookmarks?.map((bookmark) => {
                        return <BlockchainBookmarkCard bookmark={bookmark} />

                    })
                } */}
            </ContentLayout>
        </MainLayout>
    )
}

export default CommunityBookmarks