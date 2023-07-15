import { useEffect, useState } from 'react'
import { Paper, Typography } from '@mui/material'
import LocalBookmarkCard from './Cards/LocalBookmarkCard';
import HeaderLayout from './Layouts/HeaderLayout';
import MainLayout from './Layouts/MainLayout';
import ContentLayout from './Layouts/ContentLayout';

const Home = () => {
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
                    Local Bookmarks
                </Typography>
            </HeaderLayout>
            <ContentLayout>
                {
                    bookmarks?.map((bookmark) => {
                        return <LocalBookmarkCard bookmark={bookmark} />

                    })
                }
            </ContentLayout>
        </MainLayout>

    )
}

export default Home