import React, { useEffect, useState } from "react";
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined';
import { useNavigate } from "react-router-dom";
import { CHAINS_CONFIG } from "../chains";
import { ethers } from "ethers";
import { useWeb3 } from "../contexts/Web3Context/Web3Context";
import { Alert, Box, Button, Card, CircularProgress, Container, FormControl, IconButton, Input, InputAdornment, InputLabel, Link, List, ListItem, ListItemButton, ListItemText, Paper, Snackbar, Tab, Tabs, TextField, Tooltip, Typography } from "@mui/material";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CustomScrollbar from "./CustomScrollbar";
import { Visibility, VisibilityOff } from "@material-ui/icons";

type WalletViewProps = {
  selectedChain: string
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{ display: 'flex', justifyContent: 'center' }}
      {...other}
    >
      {value === index && (
        <Paper sx={{
          borderRadius: "18px",
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: `2px 3px`,
          width: '77%',
          minHeight: '265px',
          maxHeight: 'fit-content',
          marginTop: '15px',
          overflow: 'auto'

        }}>
          <CustomScrollbar>
            {children}
          </CustomScrollbar>
        </Paper>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


function WalletView({
  selectedChain,
}: WalletViewProps) {
  const navigate = useNavigate();
  const [tokens, setTokens] = useState([]);
  const [nfts, setNfts] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [amountToSend, setAmountToSend] = useState("");
  const [sendToAddress, setSendToAddress] = useState("");

  const [value, setValue] = React.useState(0);
  const [accountActivities, setAccountActivities] = useState<{ methodName: string, transactionHash: string, status: boolean }[]>([])

  const [showPrivateKey, setShowPrivateKey] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { Wallet, publicAddress, transferTokens, getPrivateKey, userBalance, userBalanceLoading } = useWeb3()


  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  async function sendTransaction(to: string, amount: string) {
    try {
      await transferTokens(to, amount);
    } catch (err) {
      setAmountToSend("");
      setSendToAddress("");
    }
    finally {
      setAmountToSend("");
      setSendToAddress("");
    }
  }



  useEffect(() => {
    if (publicAddress) {
      chrome.storage.local.get([publicAddress], function (result) {
        const accountActivityData = result[publicAddress] || [];
        setAccountActivities(accountActivityData)
      })
    }
  }, [userBalance])


  useEffect(() => {
    if (!publicAddress || !selectedChain) return;
    setNfts([]);
    setTokens([]);
  }, []);



  useEffect(() => {
    if (!publicAddress) return;
    setNfts([]);
    setTokens([]);
  }, [selectedChain]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    if (parseInt(newValue) !== 2 && showPrivateKey) {
      setShowPrivateKey(false)
      setPassword("")
    }
    setValue(parseInt(newValue));
  };


  const submitHandle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password) {
      const isPrivateKey = await getPrivateKey(password);
      setShowPasswordModal(false)
      if (isPrivateKey) {
        setShowPrivateKey(true)
      }
    }
  }

  const isPublicKeyValid = (publicKey: string) => {
    const validPublicKeyRegex = /^(0x)?[0-9a-fA-F]{40}$/;
  
    return validPublicKeyRegex.test(publicKey);
  }

  const containsOnlyPositiveNumbers = (str: string) => {
    const parsedValue = parseFloat(str);
    return !isNaN(parsedValue) && parsedValue > 0 && String(parsedValue) === str;
  }

  return (
    <>
      <Container sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0px' }}>
        <Typography component="h1" variant="h6">
          Account
        </Typography>
        <Tooltip title={publicAddress}>
          <div>
            {publicAddress?.slice(0, 4)}...{publicAddress?.slice(38)}
          </div>
        </Tooltip>
      </Container>



      <Typography component="h1" variant="h4" sx={{ textAlign: 'center', padding: "10px 0px", width: '100%', marginBottom: "10px", marginTop: '15px' }}>
        {
          userBalanceLoading ? <CircularProgress size="2rem" /> : (userBalance).toFixed(2)
        } {CHAINS_CONFIG["0x7a69"].ticker}

        <Tooltip sx={{ padding: 0, margin: 0 }} title={
          <Box sx={{ wordBreak: 'break-word', padding: 0, margin: 0, height: "100%" }}>
            <Typography sx={{ marginBottom: "4px", fontSize: '12px' }}>Using Polygon test network, get MATICS from these faucet links!</Typography>
            <Link href={"https://mumbaifaucet.com/"} target="_blank" underline="none" color='rgb(144, 202, 249)' sx={{ margin: 0, padding: 0 }}>
              <Typography
                sx={{ margin: 0, padding: 0 }}
                noWrap={true}
                color='inherit'
                fontWeight='600'
              >https://mumbaifaucet.com/</Typography>
            </Link>
            <Link href={"https://faucet.polygon.technology/"} target="_blank" underline="none" color='rgb(144, 202, 249)' sx={{ margin: 0, padding: 0 }}>
              <Typography
                sx={{ margin: 0, padding: 0 }}
                noWrap={true}
                color='inherit'
                fontWeight='600'
              >https://faucet.polygon.technology/</Typography>
            </Link>
          </Box>
        }>
          <Typography variant="caption" display="block" sx={{ width: 'fit-content', cursor: "pointer", ml: 'auto', mr: 'auto', color:'rgb(144, 202, 249)' }} gutterBottom>
            Need MATICS?
          </Typography>
        </Tooltip>
      </Typography>


      <Box sx={{ width: '100%' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
          <Tab label="Send" {...a11yProps(0)} />
          <Tab label="Activity" {...a11yProps(1)} />
          <Tab label="Account Details" {...a11yProps(2)} />
        </Tabs>
        <TabPanel value={value} index={0}>
          <TextField
            id="send-to-address"
            value={sendToAddress}
            onChange={(e) => setSendToAddress(e.target.value)}
            placeholder="0x..."
            label="Receiver Address"
            variant="outlined"
            size="small"
            sx={{ marginTop: '30px', width: '85%' }}
            error={(sendToAddress && !isPublicKeyValid(sendToAddress)) ? true : false}
          />

          <TextField
            id="outlined-basic"
            value={amountToSend}
            onChange={(e) => setAmountToSend(e.target.value)}
            placeholder="Tokens you wish to send..."
            label="Amount"
            variant="outlined"
            size="small"
            sx={{ marginTop: '20px', width: '85%' }}
            error={(amountToSend && !containsOnlyPositiveNumbers(amountToSend)) ? true : false}
          />

          <Button
            disabled={!isPublicKeyValid(sendToAddress) || !containsOnlyPositiveNumbers(amountToSend) }
            onClick={() => sendTransaction(sendToAddress, amountToSend)}
            variant="outlined"
            sx={{ marginTop: "30px", padding: "0", width: '85%' }}
          >
            Send Tokens
          </Button>


        </TabPanel>
        <TabPanel value={value} index={1}>
          {
            accountActivities.length > 0 ?
              <List>
                {
                  accountActivities.map(activity => {
                    return <ListItem
                      secondaryAction={
                        <Tooltip title="View on block explorer">
                          <IconButton edge="end" aria-label="delete" sx={{ margin: 0 }} size="small" onClick={() => window.open(`https://mumbai.polygonscan.com/tx/${activity.transactionHash}`, '_blank')}>
                            <VisibilityOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      }
                      key={activity.transactionHash}
                    >
                      <ListItemText>
                        <Typography variant="body1" sx={{ fontSize: '12px' }}>{activity.methodName}</Typography>
                      </ListItemText>
                    </ListItem>

                  })}
              </List> :
              <Box sx={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <HourglassEmptyOutlinedIcon />
              </Box>
          }
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Container sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0px' }}>
            <Typography component="h1" variant="h6">
              Account
            </Typography>
            <Tooltip title={publicAddress}>
              <Typography sx={{ width: "90%", wordWrap: "break-word", marginTop: 1 }}>
                {publicAddress}
              </Typography>
            </Tooltip>
          </Container>
          <Container sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0px' }}>
            {
              (!showPasswordModal && !showPrivateKey) && <Button
                onClick={() => setShowPasswordModal(true)}
                variant="outlined"
                sx={{ marginTop: "30px", padding: "0", width: '90%' }}
              >
                Show Private Key
              </Button>

            }
            {
              showPrivateKey &&
              <Typography sx={{ width: "90%", wordWrap: "break-word", marginTop: 1 }}>
                {Wallet && Wallet?.privateKey}
              </Typography>

            }

          </Container>
          {
            showPasswordModal && <>
              <form onSubmit={(e) => submitHandle(e)} style={{ width: '100%', display: "flex", flexDirection: "column", alignItems: "center" }}>
                <FormControl margin="normal" required fullWidth sx={{ width: "90%" }}>
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
                <Button
                  type="submit"
                  variant="outlined"
                  sx={{ margin: "10px 0", padding: "0 15px", width: '90%' }}
                >
                  Confirm
                </Button>
              </form>
            </>

          }
        </TabPanel>
      </Box>
    </>
  );
}

export default WalletView;
