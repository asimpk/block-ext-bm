import mwallet from "../mwallet.png";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import MainLayout from "./Layouts/MainLayout";
import HeaderLayout from "./Layouts/HeaderLayout";
import ContentLayout from "./Layouts/ContentLayout";
import { IconButton, Tooltip, Typography } from "@mui/material";
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useWeb3 } from "../contexts/Web3Context/Web3Context";
import CreateAccount from "./CreateAccount";
import WalletView from "./WalletView";
import SignIn from "./SignIn";




const WalletNew = () => {
  const navigate = useNavigate();
  const { publicAddress, Wallet, disconnectWallet } = useWeb3()

  console.log("publicAddress", publicAddress)
  return (
    <MainLayout>
      <HeaderLayout sx={{ display: 'flex', alignItems: 'center', justifyContent: (publicAddress && Wallet) ? 'space-between' : "center" }}>
        {(publicAddress && Wallet) && <IconButton sx={{ visibility: 'hidden' }}>
          <LogoutOutlinedIcon />
        </IconButton>
        }
        <Typography component="h1" variant="h5">
          Wallet
        </Typography>
        {(publicAddress && Wallet) &&
          <Tooltip title={'Lock'}>
            <IconButton onClick={disconnectWallet}>
              <LogoutOutlinedIcon />
            </IconButton>
          </Tooltip>}

      </HeaderLayout>
      <ContentLayout>
        {
          publicAddress ? <WalletView selectedChain="0x13881" /> : <SignIn />
        }
      </ContentLayout>
    </MainLayout>
  );
}

export default WalletNew;
