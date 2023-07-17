import { Wallet, ethers } from "ethers";
import { createContext, useContext } from "react";

type Web3ContextType = {
    Wallet: Wallet | undefined;
    publicAddress: string | undefined;
    contractInstances: ethers.Contract[]  | null,
    showConfirm: boolean,
    status: string,
    connectWallet: (password: string, seedPhrase: string, privateAccount?: string) => void;
    disconnectWallet: () => void;
    userSignIn: (passphrase: string) => void;
    getPrivateKey: (passphrase: string) => Promise<boolean>;
    encryptMessages: () => Promise<void>,
    decryptMessages: () => Promise<void>,
    createFolder: (folderName: string) => Promise<void>,
    deleteFolder: (folderId: string) => Promise<void>,
    updateFolder: (folderId: string) => Promise<void>,
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
