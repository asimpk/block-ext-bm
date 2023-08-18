import React from 'react'
import { useNavigate } from "react-router-dom";
import { Accordion, AccordionDetails, AccordionSummary, Box, Card, IconButton, Link, Menu, MenuItem, Tooltip, Typography } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BookmarksOutlinedIcon from '@material-ui/icons/BookmarksOutlined';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import ShareOutlinedIcon from '@material-ui/icons/ShareOutlined';



type NoteType = {
    note: { id: string, title: string, description: string, folderId: string },
    deleteBookmark: (folderId: string, bookmarkId: string) => void,
    moveBookmark: (fromFolderId: string, bookmarkId: string) => void,
    showUpdateOpt?: boolean,
    handlerUpdate?: (fromFolderId: string, bookmarkId: string) => void
}

const PersonalNoteAccord: React.FC<NoteType> = ({ note, deleteBookmark, moveBookmark, showUpdateOpt, handlerUpdate }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [expanded, setExpanded] = React.useState<string | false>(false);
    const navigate = useNavigate()

    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };

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
        <Accordion sx={{
            // width: "100%", height: 40, borderRadius: 4, backgroundColor: 'unset', 
            // display: 'flex',
            // padding: `4px 8px`,
            // // flexDirection: 'column',
            // alignItems: 'center',
            // cursor: 'pointer',
            margin: `4px 7px`,
            width: "100%",
            borderRadius: 4,
            backgroundImage: anchorEl ? `linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))` : 'none',
            "&:hover .actions": { visibility: 'visisble' },
            "&:hover": { backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))` },
            "&:before": { opacity: 0 },
            ".MuiPaper-root": { borderRadius: '16px !important' },
            "&:last-of-type": { borderRadius: '16px !important' }
        }}
            // onClick={() => navigate(`/blockchain-bookmarks/${bookmark?.id}/${bookmark?.id}`)}

            expanded={expanded === note.id}
            onChange={handleChange(note.id)}
            square={false}
        >
            <AccordionSummary
                sx={{  "& > .MuiAccordionSummary-content": {display: 'flex', alignItems: 'center', margin: 0} }}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
            >
                <Typography
                    noWrap={true}
                    fontSize={'0.8rem'}
                    color='inherit'
                    fontWeight='700'
                >
                    {note?.title}
                </Typography>
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
                            (showUpdateOpt && handlerUpdate) && <MenuItem key={'update'} onClick={(e) => handlerUpdate(note.folderId, note.id)} sx={{ minHeight: '22px', padding: '0px 16px' }}>
                                Update
                            </MenuItem>
                        }
                        <MenuItem key={'move'} onClick={(e) => handlerMove(e, note.folderId, note.id)} sx={{ minHeight: '22px', padding: '0px 16px' }}>
                            Move
                        </MenuItem>
                        <MenuItem key={'delete'} onClick={(e) => handlerDelete(e, note.folderId, note.id)} sx={{ minHeight: '22px', padding: '0px 16px' }}>
                            Delete
                        </MenuItem>
                    </Menu>
                </Box>

            </AccordionSummary>
            <AccordionDetails sx={{ "&:MuiAccordionDetails-root": { padding: "0 16px 8px !important" } }}>
                <Typography sx={{ textAlign: 'left' }} className='description'>
                    {note?.description}
                </Typography>
            </AccordionDetails>
        </Accordion>
    )
}

export default PersonalNoteAccord