import { Wallet, ethers } from "ethers";
import { createContext, useContext } from "react";

type Web3ContextType = {
    Wallet: Wallet | undefined;
    publicAddress: string | undefined;
    contractInstances: ethers.Contract[]  | null,
    showLoading: boolean,
    showConfirm: boolean,
    transaction: { transaction: ethers.providers.TransactionRequest, method: string, totalCost: string | undefined } | undefined,
    status: string,
    connectWallet: (password: string, seedPhrase: string, privateAccount?: string) => void;
    disconnectWallet: () => void;
    userSignIn: (passphrase: string) => void;
    getPrivateKey: (passphrase: string) => Promise<boolean>;
    getDcryptedString: (wallet: Wallet, encryptedString: string) => Promise<string>;
    createFolder: (folderName: string) => Promise<void>,
    deleteFolder: (folderId: string) => Promise<void>,
    updateFolder: (folderId: string) => Promise<void>,
    deleteBookmark: (folderId: string, BookmarkId: string) => Promise<void>,
    moveBookmark: (fromFolderId: string, toFolderId: string,  BookmarkId: string) => Promise<void>,
    closeConfirmModal: () => void,
    confirmTransaction: () => void,
    addBookmark: (folderId: string, url: string) => Promise<void>
};

export const Web3Context = createContext<Web3ContextType | null>(null);

export const useWeb3 = (): Web3ContextType => {
    const context: Web3ContextType | null = useContext(Web3Context);
    if (context === null) {
        throw new Error("You must add a <Web3rovider> into the React tree");
    }
    return context;
};
