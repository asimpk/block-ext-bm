import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ethers } from "ethers";
import { useWeb3 } from "../contexts/Web3Context/Web3Context";
import { Alert, Button, Card, Container, FormControl, Input, InputLabel, Paper, Typography } from "@mui/material";
import MainLayout from "./Layouts/MainLayout";
import HeaderLayout from "./Layouts/HeaderLayout";
import ContentLayout from "./Layouts/ContentLayout";

function CreateAccount() {
  const [newSeedPhrase, setNewSeedPhrase] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { connectWallet } = useWeb3()

  function generateWallet() {
    const mnemonic = ethers.Wallet.createRandom().mnemonic?.phrase ?? "";
    setNewSeedPhrase(mnemonic)
  }

  //"0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"

  function setWalletAndMnemonic() {
    if (newSeedPhrase && password) {
      connectWallet(password, newSeedPhrase)
    }
  }

  const validPassword = (password : string) => {
    if (password.length !== 0 &&  password.replace(/\s/g, '').length ) {
      return true
    }
    return false
  }


  return (
    <MainLayout>
      <HeaderLayout>
        <Typography component="h1" variant="h5">
          Create Account
        </Typography>
      </HeaderLayout>
      <ContentLayout>

        <Alert severity="warning">Once you generate the seed phrase, save it securely in order to
          recover your wallet in the future!</Alert>
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
            height: '100%',
            width: '90%'

          }}>
            <Button
              variant="outlined"
              sx={{ marginTop: "10px", padding: "0 15px", width: '80%' }}
              onClick={() => generateWallet()}
            >
              Generate Seed Phrase
            </Button>
            <Card variant="outlined" sx={{ width: "80%", height: "135px", marginTop: "15px", padding: "0 10px" }}>
              {newSeedPhrase && <pre style={{ whiteSpace: "pre-wrap" }}>{newSeedPhrase}</pre>}
            </Card>
            <FormControl margin="normal" required fullWidth sx={{ width: '80%' }}>
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
            disabled={
              newSeedPhrase.split(" ").length !== 12 || newSeedPhrase.slice(-1) === " " || !validPassword(password)
            }
              variant="outlined"
              sx={{ margin: "10px 0", padding: "0 15px", width: '80%' }}
              onClick={() => setWalletAndMnemonic()}
            >
              Open Your New Wallet
            </Button>
          </Paper>
          <Button
            onClick={() => navigate('/wallet')}
            variant="outlined"
            sx={{ marginTop: "25px", padding: "0", width: '70%' }}
          >
            Unlock
          </Button>
          <Button
            onClick={() => navigate('/import-account')}
            variant="outlined"
            sx={{ marginTop: "10px", padding: "0", width: '70%' }}
          >
            Import
          </Button>
        </Container>


      </ContentLayout>
    </MainLayout>
  );
}

export default CreateAccount;
