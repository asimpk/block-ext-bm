import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { useWeb3 } from '../../contexts/Web3Context/Web3Context';
import { Typography } from '@mui/material';



const ConfirmModal: React.FC = () => {
    const { closeConfirmModal, confirmTransaction } = useWeb3()
    return (

        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '70%', maxHeight: 435, marginLeft: "90px", borderRadius: "18px" } }}
            onClose={closeConfirmModal}
            open={true}
        >
            <Typography component="h1" variant="h6" sx={{ padding: "10px 30px" }}>Confirm Transaction</Typography>
            <DialogContent dividers>
                <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>

                </Box>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={closeConfirmModal}>Cancel</Button>
                <Button variant="outlined" onClick={confirmTransaction}>Confirm</Button>
            </DialogActions>
        </Dialog>

    );
}
export default ConfirmModal