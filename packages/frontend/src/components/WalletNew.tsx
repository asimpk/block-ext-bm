import { Alert, Box, CircularProgress, IconButton, Link, Snackbar, Tooltip, Typography } from "@mui/material";
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MainLayout from "./Layouts/MainLayout";
import HeaderLayout from "./Layouts/HeaderLayout";
import ContentLayout from "./Layouts/ContentLayout";
import { useWeb3 } from "../contexts/Web3Context/Web3Context";
import WalletView from "./WalletView";
import SignIn from "./SignIn";

const WalletNew = () => {
  const { publicAddress, Wallet, disconnectWallet, showLoading } = useWeb3()
  return (
    <MainLayout>
      <HeaderLayout sx={{ display: 'flex', alignItems: 'center', justifyContent: (publicAddress && Wallet) ? 'space-between' : "center" }}>
        {(publicAddress && Wallet) && <IconButton sx={{ visibility: 'hidden' }}>
          <LogoutOutlinedIcon />
        </IconButton>
        }
        <Typography component="h1" variant="h5" sx={{ display: "flex", alignItems: "center" }}>
          Wallet
        </Typography>
        {(publicAddress && Wallet) &&
          <Tooltip title={'Lock'}>
            <IconButton onClick={disconnectWallet}>
              <LogoutOutlinedIcon />
            </IconButton>
          </Tooltip>}

      </HeaderLayout>
      {
        showLoading ?

          <Box sx={{ height: '100%', display: 'flex', justifyContent: "center", alignItems: "center" }}>
            <CircularProgress />
          </Box>
          :
          <ContentLayout>
            {publicAddress ? <WalletView selectedChain="0x13881" /> : <SignIn />}
          </ContentLayout>
      }
    </MainLayout >
  );
}

export default WalletNew;
