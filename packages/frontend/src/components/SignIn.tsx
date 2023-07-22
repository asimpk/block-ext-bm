import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { useWeb3 } from "../contexts/Web3Context/Web3Context";
import { Button, Container, FormControl, IconButton, Input, InputAdornment, InputLabel, Link, Paper, Typography } from "@mui/material";
import { Visibility, VisibilityOff } from "@material-ui/icons";

const SignIn = () => {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { userSignIn } = useWeb3()

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const submitHandle = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        userSignIn(password)
    }


    return (
        <Container sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: 8,
            padding: `2px 3px 3px`,

        }}>
            <Paper sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: `2px 3px 3px`,
                borderRadius: `18px`,
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
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            autoComplete="current-password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </FormControl>
                    <Container sx={{ padding: 0, textAlign: 'end', cursor: 'pointer' }}> <Link onClick={() => navigate('/recover-account')}>Recover</Link></Container>
                    <Button
                        type="submit"
                        variant="outlined"
                        sx={{ marginBottom: "10px", marginTop: "22px", padding: "0 15px", width: '100%' }}
                    >
                        Unlock
                    </Button>
                </form>
            </Paper>
            <Button
                onClick={() => navigate('/create-account')}
                variant="outlined"
                sx={{ marginTop: "26px", padding: "0", width: '71%' }}
            >
                Create
            </Button>
            <Button
                onClick={() => navigate('/import-account')}
                variant="outlined"
                sx={{ marginTop: "10px", padding: "0", width: '71%' }}
            >
                Import
            </Button>
        </Container>

    );
}

export default SignIn;