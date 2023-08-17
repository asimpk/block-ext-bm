import { Routes, Route, useNavigate } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import BookmarksOutlinedIcon from '@material-ui/icons/BookmarksOutlined';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import AddLinkOutlinedIcon from '@mui/icons-material/AddLinkOutlined';
import CssBaseline from '@mui/material/CssBaseline';
import DashboardIcon from '@material-ui/icons/Dashboard';
import './App.css';
import { useWeb3 } from './contexts/Web3Context/Web3Context';
import { Alert, AlertTitle, Box, CircularProgress, Divider, List, ListItemButton, ListItemIcon, Paper, Snackbar, Tooltip } from '@mui/material';
import TabBookmarks from './components/TabBookmarks';
import CustomBookmarks from "./components/CustomBookmarks";
import BlockchainBookmarkDetail from './components/BlockchainBookmarkDetail';
import CommunityBookmarks from './components/CommunityBookmarks';

import RecoverAccount from './components/RecoverAccount';
import WalletNew from './components/WalletNew';
import CreateAccount from './components/CreateAccount';

import ImportAccount from './components/ImportAccount';
import FolderBookmarks from './components/FolderBookmarks';
import ConfirmModal from './components/Modals/ConfirmModal';
import { useState } from "react";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const [selectedMenu, setSelectedMenu] = useState(1);
  const { showConfirm, status } = useWeb3();
  const navigate = useNavigate();


  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="App">
        {showConfirm && <ConfirmModal />}
        {
          status === 'pending' &&
          <Snackbar open={true} sx={{ width: '100%', left: 0, right: 0 }}>
            <Alert severity="info" icon={false} sx={{ width: "100%" }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CircularProgress size="1rem" sx={{ mr: 1 }} />  Transaction is — <strong>{status}!</strong>
              </Box>
            </Alert>
          </Snackbar>
        }

        {status === 'failed' &&
          <Snackbar open={true} autoHideDuration={1000} sx={{ width: '100%', left: 0, right: 0 }}>
            <Alert severity="error" icon={false} sx={{ width: "100%" }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CircularProgress size="1rem" sx={{ mr: 1 }} />  Transaction is — <strong>{status}!</strong>
              </Box>
            </Alert></Snackbar>}
        {status === 'confirmed' &&
          <Snackbar open={true} autoHideDuration={1000} sx={{ width: '100%', left: 0, right: 0 }}>
            <Alert severity="success" icon={false} sx={{ width: "100%" }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CircularProgress size="1rem" sx={{ mr: 1 }} />  Transaction is — <strong>{'Successful'}!</strong>
              </Box>
            </Alert>
          </Snackbar>}
        <Paper
          sx={{ display: "flex", flexDirection: "column", width: "60px" }}
        >
          <List sx={{ padding: "8px 0 0 0" }}>
            <Tooltip title="Home">
              <ListItemButton key={1} onClick={() => { navigate("/"); setSelectedMenu(1) }} sx={selectedMenu === 1 ? { backgroundColor: "rgba(255, 255, 255, 0.08)" } : null}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <DashboardIcon />
                </ListItemIcon>
              </ListItemButton>
            </Tooltip>
          </List>
          <List sx={{ flex: "1", padding: "11px 0 0 0" }}>
            <Divider />
            <Tooltip title="Bookmarks">
              <ListItemButton key={2} onClick={() => { navigate("/blockchain-bookmarks"); setSelectedMenu(2) }} sx={selectedMenu === 2 ? { backgroundColor: "rgba(255, 255, 255, 0.08)" } : null}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <BookmarksOutlinedIcon />
                </ListItemIcon>
              </ListItemButton>
            </Tooltip>
            <Tooltip title="Custom Bookmarks">
              <ListItemButton key={3} onClick={() => { navigate("/custom-bookmarks"); setSelectedMenu(3) }} sx={selectedMenu === 3 ? { backgroundColor: "rgba(255, 255, 255, 0.08)", marginTop: '4px' } : { marginTop: '4px' }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <AddLinkOutlinedIcon />
                </ListItemIcon>
              </ListItemButton>
            </Tooltip>
          </List>
          <List sx={{ maxWidth: 60 }}>
            <Tooltip title="Wallet">
              <ListItemButton key={4} onClick={() => { navigate("/wallet"); setSelectedMenu(4) }} sx={selectedMenu === 4 ? { backgroundColor: "rgba(255, 255, 255, 0.08)" } : null}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <AccountCircleOutlinedIcon />
                </ListItemIcon>
              </ListItemButton>
            </Tooltip>
          </List>
        </Paper>
        <Box
          sx={{ flex: "1" }}
        >
          <Routes>
            <Route path="/" element={<WalletNew />} />
            <Route path="/blockchain-bookmarks" element={<TabBookmarks />} />
            <Route path="/custom-bookmarks" element={<CustomBookmarks />} />
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
