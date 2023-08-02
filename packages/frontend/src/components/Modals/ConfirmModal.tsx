import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { useWeb3 } from '../../contexts/Web3Context/Web3Context';
import { CircularProgress, Typography } from '@mui/material';



const ConfirmModal: React.FC = () => {
    const { transaction, closeConfirmModal, confirmTransaction, loadingTransaction } = useWeb3()
    return (

        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '70%', maxHeight: 435, marginLeft: "90px", borderRadius: "18px" } }}
            onClose={closeConfirmModal}
            open={true}
        >
            <Typography component="h1" variant="h6" sx={{ padding: "10px 30px" }}>Confirm Transaction</Typography>
            <DialogContent dividers>
                {
                    loadingTransaction ? 
                    <Box sx={{ minHeight: "130px", display: "flex", flexDirection: "column", alignItems: 'center', justifyContent: 'center' }}>
                        <CircularProgress size={"2rem"}/>
                        <Typography variant="body1">Preparing transaction....</Typography>
                    </Box> :
                        <>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: "space-between" }}>
                                <Typography variant="body1">Gas (estimated)</Typography>
                                <Typography variant="body1">{transaction?.totalCost && parseFloat(transaction.totalCost).toFixed(12)} MATIC</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: "column", alignItems: 'center', marginTop: '20px' }}>
                                <Typography variant="h6">Total Cost</Typography>
                                <Typography variant="h5" sx={{ padding: "10px" }}>{transaction?.totalCost ? parseFloat(transaction.totalCost).toFixed(12) : 0.00} MATIC</Typography>
                            </Box>
                        </>
                }

            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={closeConfirmModal}>Cancel</Button>
                <Button variant="outlined" onClick={confirmTransaction}>Confirm</Button>
            </DialogActions>
        </Dialog>

    );
}
export default ConfirmModal