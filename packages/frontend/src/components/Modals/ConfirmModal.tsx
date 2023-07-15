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
import { useWeb3 } from '../../contexts/Web3Context/Web3Context';



const ConfirmModal: React.FC = () => {
    const { showConfirm, closeConfirmModal, confirmTransaction } = useWeb3()
    return (
        <div>
            <Dialog disableEscapeKeyDown open={true} onClose={closeConfirmModal}>
                {/* <DialogTitle>Add New Folder</DialogTitle> */}
                <DialogContent>
                    <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>

                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeConfirmModal}>Cancel</Button>
                    <Button onClick={confirmTransaction}>Confirm</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
export default ConfirmModal