import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { TextField } from '@mui/material';


type AddFolderDialogTypes = {
    handleClose: () => void
    handleAdd : (folderName: string) => void
}


const  AddFolderDialog : React.FC<AddFolderDialogTypes>  = ({ handleClose, handleAdd }) =>  {
    const [folderName, setFolderName] = React.useState<string>('')

    // const handleClickOpen = () => {
    //     setOpen(true);
    // };

    // const handleClose = (event: React.SyntheticEvent<unknown>, reason?: string) => {
    //     if (reason !== 'backdropClick') {
    //         setOpen(false);
    //     }
    // };

    return (
        <div>
            <Dialog disableEscapeKeyDown open={true} onClose={handleClose}>
                {/* <DialogTitle>Add New Folder</DialogTitle> */}
                <DialogContent>
                    <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        <FormControl sx={{ m: 1, minWidth: 250 }}>
                            <TextField id="standard-basic" label="Folder Name" variant="standard" value={folderName}
                             onChange={(e) => setFolderName(e.target.value)}
                            />
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={() => handleAdd(folderName)}>Ok</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
export default AddFolderDialog