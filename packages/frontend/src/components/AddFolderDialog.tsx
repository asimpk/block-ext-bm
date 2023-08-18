import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormControl from '@mui/material/FormControl';
import { TextField, Typography } from '@mui/material';


type AddFolderDialogTypes = {
    title: string,
    handleClose: () => void
    handleAdd: (folderName: string) => void
}


const AddFolderDialog: React.FC<AddFolderDialogTypes> = ({ title, handleClose, handleAdd }) => {
    const [folderName, setFolderName] = React.useState<string>('')

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '70%', maxHeight: 435, marginLeft: "90px", borderRadius: "18px" } }}
            maxWidth="xs"
            open={true}
        >
            <Typography component="h1" variant="h6" sx={{ padding: "10px 30px" }}>Add {title}</Typography>
            <DialogContent dividers>
                <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
                    <FormControl sx={{ m: 1, minWidth: 250, width: "100%" }}>
                        <TextField id="standard-basic" label={`${title} Name`} variant="standard" value={folderName}
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