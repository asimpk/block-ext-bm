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
import { useWeb3 } from '../contexts/Web3Context/Web3Context';
import { ethers } from 'ethers';

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
    id: string;
    keepMounted: boolean;
    value: string;
    open: boolean;
    onClose: (value?: string) => void;
}

function ConfirmationDialogRaw(props: ConfirmationDialogRawProps) {
    const { onClose, value: valueProp, open, ...other } = props;
    const [value, setValue] = React.useState(valueProp);
    const radioGroupRef = React.useRef<HTMLElement>(null);

    React.useEffect(() => {
        if (!open) {
            setValue(valueProp);
        }
    }, [valueProp, open]);

    const handleEntering = () => {
        if (radioGroupRef.current != null) {
            radioGroupRef.current.focus();
        }
    };

    const handleCancel = () => {
        onClose();
    };

    const handleOk = () => {
        onClose(value);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue((event.target as HTMLInputElement).value);
    };

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
            maxWidth="xs"
            TransitionProps={{ onEntering: handleEntering }}
            open={open}
            {...other}
        >
            <DialogTitle>Phone Ringtone</DialogTitle>
            <DialogContent dividers>
                <RadioGroup
                    ref={radioGroupRef}
                    aria-label="ringtone"
                    name="ringtone"
                    value={value}
                    onChange={handleChange}
                >
                    {options.map((option) => (
                        <FormControlLabel
                            value={option}
                            key={option}
                            control={<Radio />}
                            label={option}
                        />
                    ))}
                </RadioGroup>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleCancel}>
                    Cancel
                </Button>
                <Button onClick={handleOk}>Ok</Button>
            </DialogActions>
        </Dialog>
    );
}

export default function ConfirmationDialog() {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState('Dione');
    const { Wallet, contractInstances } = useWeb3()


    const handleClickListItem = () => {
        setOpen(true);
    };

    const handleClose = (newValue?: string) => {
        setOpen(false);

        if (newValue) {
            setValue(newValue);
        }
    };

    async function estimateGasLimit(transaction: ethers.providers.TransactionRequest): Promise<ethers.BigNumber | undefined> {
        const gasLimit = await Wallet?.provider.estimateGas(transaction);
        return gasLimit;

    }

    async function getGasPrice(): Promise<ethers.BigNumber | undefined> {
        const gasPrice =  await Wallet?.provider.getGasPrice()
        return gasPrice;
    }

    // const fetchData = async () => {
    //     try {
    //         const tabs = await chrome.tabs.query({
    //             currentWindow: true,
    //             active: true
    //         });
    //         if(contractInstances){
    //             const [tabBookmarks] = contractInstances
    //             const gasLimit = await tabBookmarks.estimateGas.addBookmark(0, 'check gas limit');
    //             const gasPrice =  await getGasPrice();
    //             console.log("gasLimit", gasLimit?.toString(), gasPrice?.toString(), tabs[0])
    //         }
    //     } catch (error) {
    //         console.error('Error:', error);
    //     }
    // }

    return (
        <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {/* <Button variant="outlined" onClick={fetchData}>Add Bookmark</Button> */}
            <ConfirmationDialogRaw
                id="ringtone-menu"
                keepMounted
                open={open}
                onClose={handleClose}
                value={value}
            />
        </Box>
    );
}
