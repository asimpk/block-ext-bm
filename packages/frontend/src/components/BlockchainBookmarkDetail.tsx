import React from 'react'
import { useParams } from 'react-router-dom'
import ContentLayout from './Layouts/ContentLayout'
import HeaderLayout from './Layouts/HeaderLayout'
import MainLayout from './Layouts/MainLayout'
import { Typography } from '@mui/material'


const BlockchainBookmarkDetail = () => {
    let { bookmarkId } = useParams();
    return (
        <MainLayout>
            <HeaderLayout>
                <Typography component="h1" variant="h5">
                    Blockchain Bookmarks Detail View
                </Typography>
            </HeaderLayout>
            <ContentLayout>
                {bookmarkId}
            </ContentLayout>
        </MainLayout>
    )
}

export default BlockchainBookmarkDetail