import { Wallet, ethers } from "ethers";
import { createContext, useContext } from "react";
export type ContractName = 'tabBookmarks' | 'customBookmarks';
type Web3ContextType = {
    Wallet: Wallet | undefined;
    publicAddress: string | undefined;
    userBalance: number,
    userBalanceLoading: boolean,
    contractInstances: { [k in ContractName]: ethers.Contract } | null,
    showLoading: boolean,
    showConfirm: boolean,
    transaction: { transaction: ethers.providers.TransactionRequest, method: string, totalCost: string | undefined } | undefined,
    loadingTransaction: boolean,
    transferTokens: (toAddress: string, amount: string) => Promise<void>,
    status: string,
    connectWallet: (password: string, seedPhrase: string, privateAccount?: string) => Promise<{ status: boolean, message: string }>;
    disconnectWallet: () => void;
    userSignIn: (passphrase: string) => Promise<{ status: boolean, message: string }>;
    getPrivateKey: (passphrase: string) => Promise<boolean>;
    getDcryptedString: (wallet: Wallet, encryptedString: string) => Promise<string>;
    createFolder: (contractName: ContractName,  folderName: string) => Promise<void>,
    deleteFolder: (contractName: ContractName,  folderId: string) => Promise<void>,
    updateFolder: (contractName: ContractName, folderId: string) => Promise<void>,
    deleteBookmark: (contractName: ContractName, folderId: string, BookmarkId: string) => Promise<void>,
    moveBookmark: (contractName: ContractName, fromFolderId: string, toFolderId: string,  BookmarkId: string) => Promise<void>,
    closeConfirmModal: () => void,
    confirmTransaction: () => void,
    addTabBookmark: (folderId: string, url: string) => Promise<void>,
    addCustomBookmark: (folderId: string, url: string, title: string) => Promise<void>,
    updateCustomBookmark: (folderId: string, bookmarkId:string, url: string, title: string) => Promise<void>
};

export const Web3Context = createContext<Web3ContextType | null>(null);

export const useWeb3 = (): Web3ContextType => {
    const context: Web3ContextType | null = useContext(Web3Context);
    if (context === null) {
        throw new Error("You must add a <Web3rovider> into the React tree");
    }
    return context;
};
