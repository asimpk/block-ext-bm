import React, { useEffect, useState } from "react";
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined';
import { useNavigate } from "react-router-dom";
import { CHAINS_CONFIG } from "../chains";
import { ethers } from "ethers";
import { useWeb3 } from "../contexts/Web3Context/Web3Context";
import { Box, Button, Container, FormControl, IconButton, Input, InputLabel, List, ListItem, ListItemButton, ListItemText, Paper, Tab, Tabs, TextField, Tooltip, Typography } from "@mui/material";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CustomScrollbar from "./CustomScrollbar";



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
  const [balance, setBalance] = useState(0);
  const [fetching, setFetching] = useState(true);
  const [amountToSend, setAmountToSend] = useState("");
  const [sendToAddress, setSendToAddress] = useState("");
  const [processing, setProcessing] = useState(false);
  const [hash, setHash] = useState("");
  const [value, setValue] = React.useState(0);
  const [accountActivities, setAccountActivities] = useState<{ methodName: string, transactionHash: string, status: boolean }[]>([])
  const [showButton, setShowButton] = useState(false)
  const [showPrivateKey, setShowPrivateKey] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [password, setPassword] = useState("");

  const { Wallet, publicAddress, getPrivateKey } = useWeb3()




  async function sendTransaction(to: string, amount: string) {


    const tx = {
      to: to,
      value: ethers.utils.parseEther(amount.toString()),
    };

    setProcessing(true);
    try {
      if (Wallet) {
        const transaction = await Wallet.sendTransaction(tx);

        setHash(transaction?.hash);
        const receipt = await transaction.wait();

        setHash("");
        setProcessing(false);
        setAmountToSend("");
        setSendToAddress("");

        if (receipt?.status === 1) {
          getAccountTokens();
        } else {
          console.log("failed");
        }
      }

    } catch (err) {
      setHash("");
      setProcessing(false);
      setAmountToSend("");
      setSendToAddress("");
    }
  }

  async function getAccountTokens() {
    setFetching(true);
    if (Wallet) {
      const provider = Wallet.provider
      if (provider) {
        const address = publicAddress ?? '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
        provider.getBalance(address).then((balance) => {
          // convert a currency unit from wei to ether
          const balanceInEth = ethers.utils.formatEther(balance)
          setBalance(parseInt(balanceInEth));
          setFetching(false);
          console.log(`balance: ${balanceInEth} ETH`)
        })
      }
    }
  }

  useEffect(() => {
    if (publicAddress) {
      chrome.storage.local.get([publicAddress], function (result) {
        const accountActivityData = result[publicAddress] || [];
        setAccountActivities(accountActivityData)
      })
    }
  }, [])


  useEffect(() => {
    if (!publicAddress || !selectedChain) return;
    setNfts([]);
    setTokens([]);
    setBalance(0);
    getAccountTokens();
  }, []);



  useEffect(() => {
    if (!publicAddress) return;
    setNfts([]);
    setTokens([]);
    setBalance(0);
    getAccountTokens();
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


      <Typography component="h1" variant="h4" sx={{ textAlign: 'center', padding: "10px 0px", width: '100%', margin: "20px 0" }}>
        {(balance).toFixed(2)} {CHAINS_CONFIG["0x7a69"].ticker}
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
            label="Send to Address"
            variant="outlined"
            size="small"
            sx={{ marginTop: '30px', width: '85%' }}
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
          />

          <Button
            onClick={() => sendTransaction(sendToAddress, amountToSend)}
            variant="outlined"
            sx={{ marginTop: "30px", padding: "0", width: '85%' }}
          >
            Send Tokens
          </Button>


        </TabPanel>
        <TabPanel value={value} index={1}>
          <List>


            {
              accountActivities?.map(activity => {
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
              })
            }

          </List>
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
