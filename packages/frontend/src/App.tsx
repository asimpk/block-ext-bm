import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import BookmarksOutlinedIcon from '@material-ui/icons/BookmarksOutlined';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import CssBaseline from '@mui/material/CssBaseline';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import AssignmentIcon from '@material-ui/icons/Assignment';
import './App.css';
import { Button, FloatButton, Menu, MenuProps } from 'antd';

// import { LogoutOutlined, MenuUnfoldOutlined, HomeOutlined, ShoppingOutlined, PlusSquareOutlined } from "@ant-design/icons";
// import WalletView from './components/WalletView';
// import Home from './components/Home';
// import RecoverAccount from './components/RemoveAccount';
// import CreateAccount from './components/CreateAccount';
// import WalletHome from './components/WalletHome';
import { useWeb3 } from './contexts/Web3Context/Web3Context';
import { useAppState } from './contexts/StateConrext/StateContext';
// import BookMarks from './components/BookMarks';
import useAddBookmarkBtn from './hooks/useAddBookmarkBtn';
import { Alert, Box, Card, Container, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Snackbar, Typography } from '@mui/material';
import Home from './components/Home';
import BlockchainBookmarks from './components/BlockchainBookmarks';
import CustomScrollbar from './components/CustomScrollbar';
import BlockchainBookmarkDetail from './components/BlockchainBookmarkDetail';
import CommunityBookmarks from './components/CommunityBookmarks';

import RecoverAccount from './components/RecoverAccount';
import WalletNew from './components/WalletNew';
import CreateAccount from './components/CreateAccount';
import SignIn from './components/SignIn';
import ImportAccount from './components/ImportAccount';
import FolderBookmarks from './components/FolderBookmarks';
import ConfirmModal from './components/Modals/ConfirmModal';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const { showAddBookMarkBtn, activeTab, addBookMark } = useAddBookmarkBtn()
  const { showConfirm, status } = useWeb3()
  const navigate = useNavigate();


  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="App">

        {/* <div style={{ display: 'flex', alignItems: 'center', width: "100%", height: '70px' }}>
          {
            showAddBookMarkBtn && <Button
              style={{
                left: 55,
                top: 75,
                width: 35
              }} onClick={() => activeTab && addBookMark(activeTab)} />
          }
        </div> */}
        {showConfirm && <ConfirmModal />}
        {status === 'pending' &&
          <Snackbar open={true}>
            <Alert severity="info">
              This is an info alert — <strong>{status}!</strong>
            </Alert></Snackbar>}

        {status === 'failed' &&
          <Snackbar open={true} autoHideDuration={2000}>
            <Alert severity="error">
              This is an error alert — <strong>{status}!</strong>
            </Alert></Snackbar>}
        {status === 'confirmed' &&
          <Snackbar open={true} autoHideDuration={2000}>
            <Alert severity="success">
              This is an success alert — <strong>{status}!</strong>
            </Alert>
          </Snackbar>}



        <Paper
          sx={{ display: "flex", flexDirection: "column", width: "60px" }}
        >
          <List sx={{ padding: "8px 0 0 0" }}>
            <ListItemButton key={1} onClick={() => navigate("/")}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <DashboardIcon />
              </ListItemIcon>
            </ListItemButton>
          </List>
          <List sx={{ flex: "1", padding: "11px 0 0 0" }}>
            <Divider />
            <ListItemButton key={3} onClick={() => navigate("/blockchain-bookmarks")}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <BookmarksOutlinedIcon />
              </ListItemIcon>
            </ListItemButton>
          </List>
          <List sx={{ maxWidth: 60 }}>
            <ListItemButton key={6} onClick={() => navigate("/wallet")}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <AccountCircleOutlinedIcon />
              </ListItemIcon>
            </ListItemButton>
          </List>
        </Paper>
        <Box
          sx={{ flex: "1" }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blockchain-bookmarks" element={<BlockchainBookmarks />} />
            <Route path="/blockchain-bookmarks/:folderId" element={<FolderBookmarks />} />
            <Route path="/blockchain-bookmarks/:folderId/:bookmarkId" element={<BlockchainBookmarkDetail />} />
            <Route path="/community-bookmarks" element={<CommunityBookmarks />} />
            <Route path="/wallet" element={<WalletNew />} />
            <Route path="/recover-account" element={<RecoverAccount />} />
            <Route path="/create-account" element={<CreateAccount />} />
            <Route path="/import-account" element={<ImportAccount />} />
          </Routes>
        </Box>
      </div>
    </ThemeProvider>
  );
}

export default App;
