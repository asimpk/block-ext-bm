import React, { useEffect, useState } from "react";
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined';
import { useNavigate } from "react-router-dom";
import { CHAINS_CONFIG } from "../chains";
import { ethers } from "ethers";
import { useWeb3 } from "../contexts/Web3Context/Web3Context";
import { Box, Button, Container, IconButton, ListItem, ListItemButton, ListItemText, Paper, Tab, Tabs, TextField, Tooltip, Typography } from "@mui/material";
import { FixedSizeList, ListChildComponentProps } from 'react-window';



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
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: `2px 3px`,
          width: '77%',
          minHeight: '265px',
          maxHeight: 'fit-content',
          marginTop: '15px'

        }}>
          {children}
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

  const { Wallet, publicAddress, disconnectWallet, encryptMessages, decryptMessages } = useWeb3()




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
    setValue(parseInt(newValue));
  };


  const renderRow = (props: ListChildComponentProps) => {
    const { index, style } = props;
  
    return (
      <ListItem style={style} key={index} component="div" disablePadding>
        <ListItemButton>
          <ListItemText primary={`Item ${index + 1}`} />
        </ListItemButton>
      </ListItem>
    );
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
          <FixedSizeList
            height={"100%"}
            width={"100%"}
            itemSize={46}
            itemCount={200}
            overscanCount={5}
          >
            {renderRow}
          </FixedSizeList>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <HourglassEmptyOutlinedIcon sx={{ fontSize: 40, marginTop: 'auto', marginBottom: 'auto' }} />
        </TabPanel>
      </Box>

      {/* </Container> */}
    </>
    // <>
    //   <div className="content">
    //     <div className="walletName" style={{ display: 'flex', justifyContent: 'space-around' }}>Wallet {<LogoutOutlinedIcon onClick={() => disconnectWallet()} />}</div>
    //     {publicAddress &&
    //       <Tooltip title={publicAddress}>
    //         <div>
    //           {publicAddress.slice(0, 4)}...{publicAddress.slice(38)}
    //         </div>

    //       </Tooltip>
    //     }

    //     <Divider />

    //     {fetching ? (
    //       <Spin />
    //     ) : (
    //       <Tabs defaultActiveKey="1" items={items} className="walletView" />
    //     )}
    //   </div>
    // </>
  );
}

export default WalletView;
