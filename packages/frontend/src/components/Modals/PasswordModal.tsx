import * as React from 'react';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { Input, Paper, Typography } from '@mui/material';
import { useState } from 'react';
import { useWeb3 } from '../../contexts/Web3Context/Web3Context';



type PasswordModalTypes = {
    handleClose: (isPrivateKey: boolean) => void
}

const PasswordModal: React.FC<PasswordModalTypes> = ({ handleClose }) => {
    const [password, setPassword] = useState("");
    const { getPrivateKey } = useWeb3()

    const submitHandle = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(password){
            const isPrivateKey = await getPrivateKey(password);
            handleClose(isPrivateKey)
        }
    }

    return (
        <Paper sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: `2px 3px 3px`,
            height: '100%',
            width: '90%'

        }}>
            <Typography component="h1" variant="h5" sx={{ marginTop: '10px' }}>
                UnLock
            </Typography>
            <form onSubmit={(e) => submitHandle(e)} style={{ width: '80%' }}>
                <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <Input
                        name="password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </FormControl>
                <Button
                    type="submit"
                    variant="outlined"
                    sx={{ margin: "10px 0", padding: "0 15px", width: '100%' }}
                >
                    Confirm
                </Button>
            </form>
        </Paper>
    );
}
export default PasswordModal