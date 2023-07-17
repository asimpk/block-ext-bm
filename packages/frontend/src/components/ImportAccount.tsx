import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ethers } from "ethers";
import { useWeb3 } from "../contexts/Web3Context/Web3Context";
import { Alert, Button, Card, Container, FormControl, Input, InputLabel, Paper, Typography } from "@mui/material";
import MainLayout from "./Layouts/MainLayout";
import HeaderLayout from "./Layouts/HeaderLayout";
import ContentLayout from "./Layouts/ContentLayout";

const ImportAccount = () => {
  const [newSeedPhrase, setNewSeedPhrase] = useState("");
  const [password, setPassword] = useState("");
  const [privateKey, setPrivateKey] = useState("")
  const navigate = useNavigate();
  const { connectWallet } = useWeb3()

  function generateWallet() {
    const mnemonic = ethers.Wallet.createRandom().mnemonic?.phrase ?? "";
    setNewSeedPhrase(mnemonic)
  }

  //"0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"

  function setWalletAndMnemonic(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (privateKey && password) {
      connectWallet(password, newSeedPhrase, privateKey)
    }
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
              <FormControl margin="normal" required fullWidth sx={{ width: '100%' }}>
                <InputLabel htmlFor="private-key-password">Private Key</InputLabel>
                <Input
                  name="private-key-password"
                  type="password"
                  id="private-key-password"
                  autoComplete="private-key-password"
                  value={privateKey}
                  onChange={e => setPrivateKey(e.target.value)}
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth sx={{ width: '100%' }}>
                <InputLabel htmlFor="password">Set Password</InputLabel>
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
