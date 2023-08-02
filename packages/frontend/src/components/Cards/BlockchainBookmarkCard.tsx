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
    moveBookmark: (fromFolderId: string, bookmarkId: string) => void,
    showUpdateOpt?: boolean,
    handlerUpdate?: (fromFolderId: string, bookmarkId: string) => void
}

const BlockchainBookmarkCard: React.FC<BookMarksType> = ({ bookmark, deleteBookmark, moveBookmark, showUpdateOpt, handlerUpdate }) => {
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
            flexDirection: 'column',
            cursor: 'pointer',
            backgroundImage: anchorEl ? `linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))` : 'none',
            elevation: 0,
            "& > .actions": anchorEl ? { visibility: 'visisble' } : { visibility: 'hidden' },
            "&:hover > .actions": { visibility: 'visible' },
            "&:hover": { backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))` }
        }}
            // onClick={() => navigate(`/blockchain-bookmarks/${bookmark?.id}/${bookmark?.id}`)}
            onClick={() => window.open(bookmark?.url, '_blank')}
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
                    {
                        (showUpdateOpt && handlerUpdate) && <MenuItem key={'update'} onClick={(e) => handlerUpdate(bookmark.folderId, bookmark.id)} sx={{ minHeight: '22px', padding: '0px 16px' }}>
                            Update
                        </MenuItem>
                    }
                    <MenuItem key={'move'} onClick={(e) => handlerMove(e, bookmark.folderId, bookmark.id)} sx={{ minHeight: '22px', padding: '0px 16px' }}>
                        Move
                    </MenuItem>
                    <MenuItem key={'delete'} onClick={(e) => handlerDelete(e, bookmark.folderId, bookmark.id)} sx={{ minHeight: '22px', padding: '0px 16px' }}>
                        Delete
                    </MenuItem>
                </Menu>
            </Box>
            <Tooltip title={bookmark?.url}>
                {/* <Link href={bookmark?.url} target="_blank" underline="none" color='white' sx={{ height: 'fit-content', width: '100%', paddingTop: `16px` }} key={bookmark?.id}> */}
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
                    marginTop='15%'
                >
                    {bookmark?.url}
                </Typography>
                {/* </Link> */}
            </Tooltip>
        </Card>
    )
}

export default BlockchainBookmarkCard