import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormControl from '@mui/material/FormControl';
import { TextField } from '@mui/material';


type AddFolderDialogTypes = {
    handleClose: () => void
    handleAdd: (folderName: string) => void
}


const AddFolderDialog: React.FC<AddFolderDialogTypes> = ({ handleClose, handleAdd }) => {
    const [folderName, setFolderName] = React.useState<string>('')

    return (

        <Dialog disableEscapeKeyDown open={true} onClose={handleClose} sx={{ borderRadius: `18px !important` }}>
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
                <Button variant="outlined" onClick={handleClose}>Cancel</Button>
                <Button variant="outlined" onClick={() => handleAdd(folderName)}>Ok</Button>
            </DialogActions>
        </Dialog>
    );
}
export default AddFolderDialog