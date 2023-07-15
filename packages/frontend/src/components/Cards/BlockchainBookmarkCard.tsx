import React from 'react'
import { useNavigate } from "react-router-dom";
import { Card, IconButton, Link, Tooltip, Typography } from '@mui/material'
import BookmarksOutlinedIcon from '@material-ui/icons/BookmarksOutlined';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import ShareOutlinedIcon from '@material-ui/icons/ShareOutlined';



type BookMarksType = {
    bookmark: { id: string, url: string, folderId: string }
}

const BlockchainBookmarkCard : React.FC<BookMarksType> = ({ bookmark }) => {
  const navigate = useNavigate()
  return (
    <Card sx={{
        width: 100, minWidth: 96, height: 120, borderRadius: 4, maxWidth: 120, backgroundColor: 'unset', margin: `10px 7px`,
        display: 'flex',
        padding: `4px 3px`,
        flexDirection: 'column'
    }}
    onClick={() => navigate(`/blockchain-bookmarks/${bookmark?.id}/${bookmark?.id}`)}
    >
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Tooltip title={'Share With Community'}>
                <IconButton aria-label="share" size="small" style={{ width: 'fit-content', fontSize: '0.8rem', padding: '5px 2px' }}>
                    <ShareOutlinedIcon fontSize='inherit' />
                </IconButton>
            </Tooltip>
        </div>
        <Tooltip title={bookmark?.url}>
            <Link href={bookmark?.url} target="_blank" underline="none" color='white' sx={{ height: 'fit-content', width: '100%', paddingTop: `16px` }} key={bookmark?.id}>
                <img
                    width={'28px'}
                    src={`https://mui.com/static/logo.png`}
                    alt={'url_icon'}
                    loading="lazy"
                />
                <Typography
                    noWrap={true}
                    fontSize={'0.8rem'}
                    color='inherit'
                    fontWeight='700'
                >
                    {bookmark?.url}
                </Typography>
            </Link>
        </Tooltip>
    </Card>
  )
}

export default BlockchainBookmarkCard