import React from 'react'
import { useNavigate } from "react-router-dom";
import { Box, Card, IconButton, Link, Menu, MenuItem, Tooltip, Typography } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BookmarksOutlinedIcon from '@material-ui/icons/BookmarksOutlined';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import ShareOutlinedIcon from '@material-ui/icons/ShareOutlined';



type BookMarksType = {
    bookmark: { id: string, url: string, folderId: string },
    deleteBookmark: (folderId: string, bookmarkId: string) => void,
    moveBookmark: (fromFolderId: string, bookmarkId: string) => void
}

const BlockchainBookmarkCard: React.FC<BookMarksType> = ({ bookmark, deleteBookmark, moveBookmark }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const navigate = useNavigate()

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        event.stopPropagation()
    };
    const handleClose = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(null);
        event.stopPropagation()
    };

    const handlerDelete = (event: React.MouseEvent<HTMLElement>, folderId: string, bookmarkId: string) => {
        deleteBookmark(folderId, bookmarkId);
        handleClose(event)
    }
    const handlerMove = (event: React.MouseEvent<HTMLElement>, folderId: string, bookmarkId: string) => {
        moveBookmark(folderId, bookmarkId);
        handleClose(event)
    }


    return (
        <Card sx={{
            width: 100, minWidth: 96, height: 100, borderRadius: 4, maxWidth: 120, backgroundColor: 'unset', margin: `10px 7px`,
            display: 'flex',
            padding: `4px 3px`,
            flexDirection: 'column'
        }}
            onClick={() => navigate(`/blockchain-bookmarks/${bookmark?.id}/${bookmark?.id}`)}
        >
            <Box style={{ display: 'flex', justifyContent: 'flex-end', width: "fit-content", marginLeft: 'auto' }} className='actions' onClick={handleClick}>
                <IconButton aria-label="share" size="small" style={{ width: 'fit-content', fontSize: '0.8rem', padding: '5px 2px', marginRight: '2px' }}>
                    <MoreVertIcon fontSize='small' />
                </IconButton>
                <Menu
                    id="long-menu"
                    MenuListProps={{
                        'aria-labelledby': 'long-button',
                    }}
                    anchorEl={anchorEl}
                    open={anchorEl ? true : false}
                    onClose={handleClose}
                >
                    <MenuItem key={'delete'} onClick={(e) => handlerDelete(e, bookmark.folderId, bookmark.id)} sx={{ minHeight: '22px', padding: '0px 16px' }}>
                        Delete
                    </MenuItem>
                    <MenuItem key={'delete'} onClick={(e) => handlerMove(e, bookmark.folderId, bookmark.id)} sx={{ minHeight: '22px', padding: '0px 16px' }}>
                        Move
                    </MenuItem>
                </Menu>
            </Box>
            <Tooltip title={bookmark?.url}>
                <Link href={bookmark?.url} target="_blank" underline="none" color='white' sx={{ height: 'fit-content', width: '100%', paddingTop: `16px` }} key={bookmark?.id}>
                    {/* <img
                        width={'28px'}
                        src={`https://mui.com/static/logo.png`}
                        alt={'url_icon'}
                        loading="lazy"
                    /> */}
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