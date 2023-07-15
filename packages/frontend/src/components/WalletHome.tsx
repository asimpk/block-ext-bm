import mwallet from "../mwallet.png";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import MainLayout from "./Layouts/MainLayout";
import HeaderLayout from "./Layouts/HeaderLayout";
import ContentLayout from "./Layouts/ContentLayout";
import { Typography } from "@mui/material";




function WalletHome() {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <HeaderLayout>
        <Typography component="h1" variant="h5">
          Wallet
        </Typography>
      </HeaderLayout>
      <ContentLayout>
        <div className="content">
          <img src={mwallet} alt="logo" className="frontPageLogo" />
          <h2> Hey There 👋 </h2>
          <h4 className="h4"> Welcome to your Web3 Wallet</h4>
          <Button
            onClick={() => navigate("/mywallet")}
            className="frontPageButton"
            type="primary"
          >
            Create A Wallet
          </Button>
          <Button
            onClick={() => navigate("/recover")}
            className="frontPageButton"
            type="default"
          >
            Sign In With Seed Phrase
          </Button>
          <p className="frontPageBottom" onClick={() => navigate("/")}>
            Back Home
          </p>
        </div>

      </ContentLayout>
    </MainLayout>
  );
}

export default WalletHome;
