import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import FormControlLabel from '@mui/material/FormControlLabel';
import CustomScrollbar from './CustomScrollbar';
import { useAppState } from '../contexts/StateConrext/StateContext';
import { FormControl, Input, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

export interface ConfirmationDialogRawProps {
    handleClose: () => void
    handleAdd: (folderId: string, title: string, url: string) => void,
    handleMove: (folderId: string) => void,
    handleShowFolder: () => void,
    handleUpdate: (id: string, url: string, title: string, folderId: string) => void,
    exemptFolderId?: string,
    bookmark?: { id: string, url: string, title: string, folderId: string }
}

const AddCustomBookmarkDialog = (props: ConfirmationDialogRawProps) => {
    const { handleClose, handleAdd, handleShowFolder, handleMove, handleUpdate, bookmark, exemptFolderId } = props;
    const [folder, setFolder] = useState("");
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");

    const { customBookmarks } = useAppState()


    const handleClick = () => {
        if (folder && title && url) {
            handleAdd(folder, title, url)
        }
    }

    useEffect(() => {
        if (bookmark) {
            setFolder(bookmark.folderId)
            setTitle(bookmark.title)
            setUrl(bookmark.url)
        }
    }, [bookmark])



    // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setValue((event.target as HTMLInputElement).value);
    // };

    const filtertabBookmarks = exemptFolderId ? customBookmarks.filter(tab => tab?.folderId !== exemptFolderId) : customBookmarks;

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '70%', maxHeight: 435, marginLeft: "90px", borderRadius: "18px" } }}
            maxWidth="xs"
            open={true}
        >
            <Typography component="h1" variant="h6" sx={{ padding: "10px 30px" }}>
                {exemptFolderId ? "Move" : bookmark ? "Update" : "Add"} Custom Bookmark</Typography>
            {
                filtertabBookmarks?.length > 0 ?
                    <><DialogContent dividers sx={{ height: 240 }}>
                        <Box
                            component="form"
                            sx={{
                                '& > :not(style)': { m: 1 },
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            {
                                exemptFolderId ?
                                    <FormControl variant="standard" margin="normal" required fullWidth>
                                        <InputLabel id="demo-simple-select-standard-label">Folder</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-standard-label"
                                            id="demo-simple-select-standard"
                                            value={folder}
                                            onChange={e => setFolder(e.target.value)}
                                            label="Folder"
                                            variant='standard'
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            {filtertabBookmarks.map((option) => (
                                                <MenuItem value={option.folderId}>{option.name}</MenuItem>
                                            ))}

                                        </Select>
                                    </FormControl> :
                                    <>
                                        <FormControl variant="standard" margin="normal" required fullWidth>
                                            <InputLabel id="title">Title</InputLabel>
                                            <Input
                                                name="title"
                                                id="title"
                                                type={'text'}
                                                value={title}
                                                onChange={e => setTitle(e.target.value)}
                                            />
                                        </FormControl>
                                        <FormControl variant="standard" margin="normal" required fullWidth>
                                            <InputLabel id="link">Link</InputLabel>
                                            <Input
                                                name="link"
                                                id="link"
                                                type={'text'}
                                                value={url}
                                                onChange={e => setUrl(e.target.value)}
                                            />
                                        </FormControl>
                                        {
                                            !bookmark &&
                                            <FormControl variant="standard" margin="normal" required fullWidth>
                                                <InputLabel id="demo-simple-select-standard-label">Folder</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-standard-label"
                                                    id="demo-simple-select-standard"
                                                    value={folder}
                                                    onChange={e => setFolder(e.target.value)}
                                                    label="Folder"
                                                    variant='standard'
                                                >
                                                    <MenuItem value="">
                                                        <em>None</em>
                                                    </MenuItem>
                                                    {filtertabBookmarks.map((option) => (
                                                        <MenuItem value={option.folderId}>{option.name}</MenuItem>
                                                    ))}

                                                </Select>
                                            </FormControl>
                                        }
                                    </>
                            }
                        </Box>
                    </DialogContent>

                        <DialogActions>
                            <Button variant='outlined' autoFocus onClick={handleClose}>
                                Cancel
                            </Button>
                            {
                                exemptFolderId ? <Button variant='outlined' onClick={() => { folder && handleMove(folder) }}>Move</Button>
                                    : bookmark ? <Button variant='outlined' onClick={() => handleUpdate(bookmark.id, url, title, folder)}>Update</Button> :
                                        <Button variant='outlined' onClick={handleClick}>Add</Button>
                            }

                        </DialogActions></> :
                    <>
                        <DialogContent dividers sx={{ height: 240 }}>
                            <Box sx={{ height: '100%', display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                                <Button variant='outlined' autoFocus onClick={handleShowFolder}>
                                    Please Add Folder first!
                                </Button>
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button variant='outlined' autoFocus onClick={handleClose}>
                                Cancel
                            </Button>
                        </DialogActions>
                    </>
            }
        </Dialog>
    );
}

export default AddCustomBookmarkDialog