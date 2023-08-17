import React from 'react'
import { useNavigate } from "react-router-dom";
import { Box, Card, IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert';



type BookMarksType = {
    bookmarkFolder: { folderId: string, name: string, bookmarksCount: number },
    deleteFolder: (folderId: string) => void,
    updateFolder: (folderId: string) => void,
    selectFolder: (folderId: string) => void,
}

const BookmarkFolderCard: React.FC<BookMarksType> = ({ bookmarkFolder, selectFolder, deleteFolder, updateFolder }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);


    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        event.stopPropagation()
    };
    const handleClose = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(null);
        event.stopPropagation()
    };

    const handlerDelete = (event: React.MouseEvent<HTMLElement>, folderId: string) => {
        deleteFolder(folderId);
        handleClose(event)
    }

    const handlerUpdate = (event: React.MouseEvent<HTMLElement>, folderId: string) => {
        updateFolder(folderId);
        handleClose(event)
    }

    return (
        <Card sx={{
            width: 100, minWidth: 96, height: 90, borderRadius: 4, maxWidth: 120, margin: `10px 7px`,
            display: 'flex',
            padding: `4px 3px`,
            flexDirection: 'column',
            cursor: 'pointer',
            backgroundImage: anchorEl ? `linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))` : 'none',
            elevation: 0,
            "& > .actions": anchorEl ? { visibility: 'visisble' } : { visibility: 'hidden' },
            "&:hover > .actions": { visibility: 'visible' },
            "&:hover": { backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))` },

        }}
            onClick={() => selectFolder(bookmarkFolder?.folderId)}
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
                    <MenuItem key={'delete'} onClick={(e) => handlerDelete(e, bookmarkFolder.folderId)} sx={{ minHeight: '22px', padding: '0px 16px' }}>
                        Delete
                    </MenuItem>
                </Menu>
            </Box>
            <Tooltip title={`${bookmarkFolder?.name} contains ${bookmarkFolder.bookmarksCount} bookmarks`}>
                <Typography
                    noWrap={true}
                    fontSize={'0.8rem'}
                    color='inherit'
                    fontWeight='700'
                    marginTop='7px'
                >
                    {bookmarkFolder?.name}
                </Typography>
            </Tooltip>
        </Card>
    )
}

export default BookmarkFolderCard