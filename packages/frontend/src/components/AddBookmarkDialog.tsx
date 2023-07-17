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
    handleAdd: (folderName: string) => void
}

const AddBookmarkDialog = (props: ConfirmationDialogRawProps) => {
    const { handleClose, handleAdd } = props;
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

    return (

        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435, marginLeft: "20px" } }}
            maxWidth="xs"
            TransitionProps={{ onEntering: handleEntering }}
            open={true}
        >
            <DialogTitle>Select Folder</DialogTitle>

            <DialogContent dividers sx={{ height: 200 }}>
                <CustomScrollbar>
                    {/* <div> */}
                    <RadioGroup
                        ref={radioGroupRef}
                        aria-label="ringtone"
                        name="ringtone"
                        value={value}
                        onChange={handleChange}
                    >
                        {/* <CustomScrollbar> */}
                        {tabBookmarks.map((option) => (
                            <FormControlLabel
                                value={option.folderId}
                                key={option.folderId}
                                control={<Radio />}
                                label={option.name}
                            />

                        ))}


                    </RadioGroup>
                    {/* </div> */}
                </CustomScrollbar>

            </DialogContent>

            <DialogActions>
                <Button autoFocus onClick={handleClose}>
                    Cancel
                </Button>
                <Button onClick={() => handleAdd(value)}>Ok</Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddBookmarkDialog