import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ethers } from "ethers";
import { useWeb3 } from "../contexts/Web3Context/Web3Context";
import { Alert, Button, Container, FormControl, IconButton, Input, InputAdornment, InputLabel, Paper, TextField, Typography } from "@mui/material";
import MainLayout from "./Layouts/MainLayout";
import HeaderLayout from "./Layouts/HeaderLayout";
import ContentLayout from "./Layouts/ContentLayout";
import TextareaAutosize from '@mui/base/TextareaAutosize';
import { Visibility, VisibilityOff } from "@material-ui/icons";

function RecoverAccount() {
  const navigate = useNavigate();
  const [typedSeed, setTypedSeed] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [nonValid, setNonValid] = useState(false);

  const { connectWallet } = useWeb3()


  const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };



  function seedAdjust(e: { target: { value: React.SetStateAction<string>; }; }) {
    setNonValid(false);
    setTypedSeed(e.target.value);
  }

  function recoverWallet() {
    try {
      connectWallet(password, typedSeed);
    } catch (err) {
      setNonValid(true);
      return;
    }
    navigate("/yourwallet");
    return;
  }

  const validPassword = (password: string) => {
    if (password.length !== 0 && password.replace(/\s/g, '').length) {
      return true
    }
    return false
  }

  return (

    <MainLayout>
      <HeaderLayout>
        <Typography component="h1" variant="h5">
          Recover Account
        </Typography>
      </HeaderLayout>
      <ContentLayout>
        <Alert severity="info">
          Type your seed phrase in the field below to recover your wallet (it
          should include 12 words seperated with spaces)</Alert>

        <Container sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: '5px',
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
            <TextField
              label="Type your seed phrase here..."
              multiline
              rows={4}
              value={typedSeed}
              onChange={seedAdjust}
              // placeholder="Type your seed phrase here..."
              sx={{ width: "80%", marginTop: '10px' }}
            />
            <FormControl margin="normal" required fullWidth sx={{ width: '80%' }}>
              <InputLabel htmlFor="password">Set Password</InputLabel>
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
            <Button
              disabled={
                typedSeed.split(" ").length !== 12 || typedSeed.slice(-1) === " " || !validPassword(password)
              }
              sx={{ marginBottom: "10px", marginTop: "22px", padding: "0 15px", width: '80%' }}
              variant="outlined"
              onClick={() => recoverWallet()}
            >
              Recover Wallet
            </Button>
          </Paper>
          {nonValid && <p style={{ color: "red" }}> Invalid Seed Phrase</p>}
          <Button
            onClick={() => navigate('/wallet')}
            variant="outlined"
            sx={{ marginTop: "26px", padding: "0", width: '70%' }}
          >
            Unlock
          </Button>
          <Button
            onClick={() => navigate('/create-account')}
            variant="outlined"
            sx={{ marginTop: "10px", padding: "0", width: '70%' }}
          >
            Create
          </Button>
        </Container>
      </ContentLayout>
    </MainLayout>

  );
}

export default RecoverAccount;
