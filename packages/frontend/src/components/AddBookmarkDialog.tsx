import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import CustomScrollbar from './CustomScrollbar';
import { useAppState } from '../contexts/StateConrext/StateContext';
import { Typography } from '@mui/material';

const options = [
    'None',
    'Atria',
    'Callisto',
    'Dione',
    'Ganymede',
    'Hangouts Call',
    'Luna',
    'Oberon',
    'Phobos',
    'Pyxis',
    'Sedna',
    'Titania',
    'Triton',
    'Umbriel',
];

export interface ConfirmationDialogRawProps {
    handleClose: () => void
    handleAdd: (folderName: string) => void,
    handleShowFolder: () => void,
    exemptFolderId?: string
}

const AddBookmarkDialog = (props: ConfirmationDialogRawProps) => {
    const { handleClose, handleAdd, handleShowFolder, exemptFolderId } = props;
    const [value, setValue] = React.useState("");
    const radioGroupRef = React.useRef<HTMLElement>(null);
    const { tabBookmarks } = useAppState()
    const handleEntering = () => {
        if (radioGroupRef.current != null) {
            radioGroupRef.current.focus();
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue((event.target as HTMLInputElement).value);
    };

    const filtertabBookmarks = exemptFolderId ? tabBookmarks.filter(tab => tab?.folderId !== exemptFolderId) : tabBookmarks;

    return (

        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '70%', maxHeight: 435, marginLeft: "90px", borderRadius: "18px" } }}
            maxWidth="xs"
            TransitionProps={{ onEntering: handleEntering }}
            open={true}
        >
            <Typography component="h1" variant="h6" sx={{ padding: "10px 30px" }}>Select Folder</Typography>
            <DialogContent dividers sx={{ height: 200 }}>
                {
                    filtertabBookmarks?.length > 0 ?
                        <CustomScrollbar>
                            <RadioGroup
                                ref={radioGroupRef}
                                aria-label="ringtone"
                                name="ringtone"
                                value={value}
                                onChange={handleChange}
                                sx={{ ml: "12px" }}
                            >
                                {filtertabBookmarks.map((option) => (
                                    <FormControlLabel
                                        value={option.folderId}
                                        key={option.folderId}
                                        control={<Radio />}
                                        label={option.name}
                                    />
                                ))}
                            </RadioGroup>
                        </CustomScrollbar> :
                        <Box sx={{ height: '100%', display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                            <Button variant='outlined' autoFocus onClick={handleShowFolder}>
                                Please Add Folder first!
                            </Button>
                        </Box>
                }
            </DialogContent>

            <DialogActions>
                <Button variant='outlined' autoFocus onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant='outlined' onClick={() => handleAdd(value)}>Ok</Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddBookmarkDialog