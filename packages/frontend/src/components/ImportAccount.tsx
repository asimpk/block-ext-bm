import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ethers } from "ethers";
import { useWeb3 } from "../contexts/Web3Context/Web3Context";
import { Alert, Button, Card, Container, FormControl, IconButton, Input, InputAdornment, InputLabel, Paper, Typography } from "@mui/material";
import MainLayout from "./Layouts/MainLayout";
import HeaderLayout from "./Layouts/HeaderLayout";
import ContentLayout from "./Layouts/ContentLayout";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import FormHelperText from "@material-ui/core/FormHelperText";

const ImportAccount = () => {
  const [newSeedPhrase, setNewSeedPhrase] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [privateKey, setPrivateKey] = useState("")
  const [error, setError] = useState<undefined | string>();
  const navigate = useNavigate();
  const { connectWallet } = useWeb3()


  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleClickShowPrivateKey = () => setShowPrivateKey((show) => !show);

  const handleMouseDownPrivateKey = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const setWalletAndMnemonic = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (privateKey && password) {
      const respMsg = await connectWallet(password, newSeedPhrase, privateKey);
      if (respMsg && !respMsg.status) {
        setError(respMsg.message)
      }
    }
  }


  const validPassword = (password: string) => {
    if (password.length !== 0 && !(/\s/.test(password))) {
      return true
    }
    return false
  }

  const isPrivateKeyValid = (privateKey: string) => {
    const validPrivateKeyRegex = /^(0x)?[0-9a-fA-F]{64}$/;

    return validPrivateKeyRegex.test(privateKey);
  }



  return (
    <MainLayout>
      <HeaderLayout>
        <Typography component="h1" variant="h5">
          Import Account
        </Typography>
      </HeaderLayout>
      <ContentLayout>
        <Alert severity="warning">Once you set password, save it securely in order to
          UnLock your wallet in the future!</Alert>
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
            <Typography component="h1" variant="h5" sx={{ marginTop: '10px' }}>
              Import
            </Typography>

            <form onSubmit={(e) => setWalletAndMnemonic(e)} style={{ width: '80%' }}>
              {error && <FormHelperText variant="standard" sx={{ color: "red", textAlign: 'center' }}>{error}</FormHelperText>}
              <FormControl margin="normal" variant="standard" required fullWidth sx={{ width: '100%' }}>
                <InputLabel htmlFor="private-key-password">Private Key</InputLabel>
                <Input
                  name="private-key-password"
                  id="private-key-password"
                  type={showPrivateKey ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPrivateKey}
                        onMouseDown={handleMouseDownPrivateKey}
                      >
                        {showPrivateKey ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  autoComplete="current-password"
                  value={privateKey}
                  onChange={e => setPrivateKey(e.target.value)}
                  error={(privateKey && !isPrivateKeyValid(privateKey)) ? true : false}
                />
              </FormControl>
              <FormControl margin="normal" variant="standard" required fullWidth sx={{ width: '100%' }}>
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
                  error={(password && !validPassword(password)) ? true : false}
                />
              </FormControl>
              <Button
                disabled={!password || !validPassword(password)}
                variant="outlined"
                type="submit"
                sx={{ marginBottom: "10px", marginTop: "22px", padding: "0 15px", width: '100%' }}
              >
                Import
              </Button>
            </form>
          </Paper>
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

export default ImportAccount;
