import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ContractName, Web3Context } from "./Web3Context";
import { CHAINS_CONFIG } from "../../chains";
import { Wallet, ethers } from "ethers";
import EthCrypto from 'eth-crypto';
import { nanoid } from 'nanoid'
import { contractsAbi } from '../../abis'

import { decryptMnemonic, encryptMnemonic, generateSalt, base64StringToArrayBuffer, arrayBufferToBase64String, generatePasswordHash, generateUserKeyFromMnemonic, deriveWrappingKey, getWrappedKey, getUnwrappedKey, uint8ArrayToBase64, base64ToUint8Array } from "./secure";
import { TabBookmarksTypes } from "../StateConrext/StateContext";



interface ContractData {
    abi: any;
    address: string;
    name: ContractName
}

// const CONTRACT_ADDRESS_MUMBAI = "0x2e9793f057b8efc18e14630aebe8d86b2f3d26a4"
// mumbai deployed
// const CONTRACT_ADDRESS_TabBookMarks = "0x2b90522b272d61f56e6272ed3d371684c9faced5"
// const CONTRACT_ADDRESS_CUSTOMBookMarks = "0x74bdd566965aeec114b6f3666cf9cbea0f381e9b"

const CONTRACT_ADDRESS_TabBookMarks = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
const CONTRACT_ADDRESS_CUSTOMBookMarks = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
const CONTRACT_ADDRESS_PERSONALNOTES = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"

export const Web3Provider: React.FC<{ children: any }> = ({ children }) => {
    const [wallet, setWallet] = useState<Wallet>()
    const [publicAddress, setPublicAddress] = useState<string>()
    const [unWrappedKey, setUnWrappedKey] = useState<CryptoKey>()
    // const [contractInstances, setContractInstances] = useState<{ name: ContractName, contract: ethers.Contract }[] | null>(null);
    const [contractInstances, setContractInstances] = useState<{ [k in ContractName]: ethers.Contract } | null>(null);
    const [showConfirm, setShowConfirm] = useState(false)
    const [transaction, setTransaction] = useState<{ transaction: ethers.providers.TransactionRequest, method: string, totalCost: string | undefined }>()
    const [status, setStatus] = useState('idle');
    const [loadingTransaction, setLoadingTransaction] = useState(false)
    const [userBalance, setUserBalance] = useState<number>(0)
    const [userBalanceLoading, setUserBalanceLoading] = useState(false)
    const [showLoading, setShowLoading] = useState(true)
    const navigate = useNavigate();

    const getContractInstances = async (
        WalletTemp: ethers.Wallet,
        contractData: ContractData[]
    ): Promise<{ [k in ContractName]: ethers.Contract }[]> => {
        const contractInstances = await Promise.all(
            contractData.map(async (contract) => {
                const deployedContract = new ethers.Contract(contract.address, contract.abi, WalletTemp);
                const contractName = contract.name;
                return { [contractName]: deployedContract } as Record<ContractName, ethers.Contract>;
            })
        );
        return contractInstances;
    };

    useEffect(() => {
        chrome && chrome.storage.session.get(["sessionkey"]).then(async (result) => {
            const resultLocal = await chrome.storage.local.get(["encryptMnemonicStore", "wrappedKeyString"])
            const { sessionkey } = result;
            let retrievedSessionK, retrievedwrappedKey;
            if (sessionkey && resultLocal.wrappedKeyString) {
                const storedKeyArrayBuffer = base64StringToArrayBuffer(sessionkey);
                retrievedSessionK = await window.crypto.subtle.importKey(
                    // Specify that the key is in raw format, i.e. just a byte sequence
                    'raw',
                    // The key's bytes
                    storedKeyArrayBuffer,
                    // This key will be used for AES-KW
                    'AES-KW',
                    // Make the key not extractable
                    true,
                    // This key can be used to wrap and unwrap other keys only
                    ['wrapKey', 'unwrapKey']
                )
                retrievedwrappedKey = base64StringToArrayBuffer(resultLocal.wrappedKeyString);
                if (resultLocal.encryptMnemonicStore && retrievedSessionK && retrievedwrappedKey) {
                    let privateKey
                    const unWrappedKey = await getUnwrappedKey(retrievedwrappedKey, retrievedSessionK)
                    const decryptedMnemonic = await decryptMnemonic(unWrappedKey, resultLocal.encryptMnemonicStore)
                    const chain = CHAINS_CONFIG["0x7a69"];
                    const provider1 = new ethers.providers.JsonRpcProvider(chain.rpcUrl);
                    if (decryptedMnemonic.split(" ").length === 12) {
                        privateKey = ethers.Wallet.fromMnemonic(decryptedMnemonic).privateKey;
                    } else {
                        privateKey = decryptedMnemonic;
                    }
                    const WalletTemp = new ethers.Wallet(privateKey, provider1);
                    const publicKey = WalletTemp?.address;
                    setUnWrappedKey(unWrappedKey)
                    setPublicAddress(publicKey)
                    setWallet(WalletTemp);
                    getAccountTokens(WalletTemp, publicKey)
                    const contractsData: ContractData[] = [
                        // Add contract ABIs and addresses here
                        {
                            abi: contractsAbi.tabBookmarksAbi,
                            address: CONTRACT_ADDRESS_TabBookMarks,
                            name: "tabBookmarks"
                        },
                        {
                            abi: contractsAbi.customBookmarksAbi,
                            address: CONTRACT_ADDRESS_CUSTOMBookMarks,
                            name: "customBookmarks"
                        },
                        {
                            abi: contractsAbi.personalNotesAbi,
                            address: CONTRACT_ADDRESS_PERSONALNOTES,
                            name: "personalNotes"
                        }
                    ];
                    const contracts = await getContractInstances(WalletTemp, contractsData);

                    // // Convert the contracts array into an array of objects with the desired structure
                    // const contractArray = Object.entries(contracts).map(([name, contract]) => ({
                    //     name: name as ContractName,
                    //     contract: contract[name as ContractName],
                    // }));

                    // setContractInstances(contractArray)

                    const contractObject = contracts.reduce((acc, contract) => {
                        const name = Object.keys(contract)[0] as ContractName;
                        acc[name] = contract[name];
                        return acc;
                    }, {} as { [k in ContractName]: ethers.Contract });

                    setContractInstances(contractObject);
                    navigate("/wallet");

                }
            }
            setShowLoading(false)
        });
    }, [])


    useEffect(() => {
        if (!transaction) {
            if (status === 'confirmed' || 'failed') {
                setTimeout(() => {
                    setStatus('idle')
                }, 1500)
            } else {
                setStatus('idle')
            }

        }
    }, [transaction])



    const connectWallet = async (password: string, seedPhrase: string, privateAccount?: string): Promise<{ status: boolean, message: string }> => {
        if (privateAccount) {
            try {
                const userSalt = await generateSalt(privateAccount)
                const passwordHash = await generatePasswordHash(password, userSalt)
                const wrappingKey = await deriveWrappingKey(password, userSalt)
                const userKey = await generateUserKeyFromMnemonic(privateAccount, userSalt)
                const wrappedKey = await getWrappedKey(userKey, wrappingKey);
                const unWrappedKey = await getUnwrappedKey(wrappedKey, wrappingKey)

                const encryptMnemonicStore = await encryptMnemonic(unWrappedKey, privateAccount);
                const chain = CHAINS_CONFIG["0x7a69"];
                const provider = new ethers.providers.JsonRpcProvider(chain.rpcUrl);
                // const privateKey = ethers.Wallet.fromMnemonic(seedPhrase).privateKey;
                const privateKey = privateAccount;
                const WalletTemp = new ethers.Wallet(privateKey, provider);

                const contractsData: ContractData[] = [
                    // Add contract ABIs and addresses here
                    {
                        abi: contractsAbi.tabBookmarksAbi,
                        address: CONTRACT_ADDRESS_TabBookMarks,
                        name: "tabBookmarks"
                    },
                    {
                        abi: contractsAbi.customBookmarksAbi,
                        address: CONTRACT_ADDRESS_CUSTOMBookMarks,
                        name: "customBookmarks"
                    },
                    {
                        abi: contractsAbi.personalNotesAbi,
                        address: CONTRACT_ADDRESS_PERSONALNOTES,
                        name: "personalNotes"
                    }
                ];


                const publicKey = WalletTemp?.address;
                const buffer = await window.crypto.subtle.exportKey('raw', wrappingKey);
                const sessionkey = arrayBufferToBase64String(buffer);
                const wrappedKeyString = arrayBufferToBase64String(wrappedKey);
                const userSaltString = uint8ArrayToBase64(userSalt)
                await chrome.storage.local.set({ encryptMnemonicStore, passwordHash, wrappedKeyString, userSalt: userSaltString })
                chrome.storage.session.set({ sessionkey }).then(async () => {
                    const contracts = await getContractInstances(WalletTemp, contractsData);

                    const contractObject = contracts.reduce((acc, contract) => {
                        const name = Object.keys(contract)[0] as ContractName;
                        acc[name] = contract[name];
                        return acc;
                    }, {} as { [k in ContractName]: ethers.Contract });
                    setUnWrappedKey(unWrappedKey)
                    setPublicAddress(publicKey)
                    setWallet(WalletTemp)
                    getAccountTokens(WalletTemp, publicKey)
                    setContractInstances(contractObject)
                    navigate("/wallet")
                })
                return { status: true, message: "Successfully connected with Wallet!" }
            } catch (error) {
                return { status: false, message: "Error in Importing account!" }
            }
        } else {
            try {
                const userSalt = await generateSalt(seedPhrase)
                const passwordHash = await generatePasswordHash(password, userSalt)
                const wrappingKey = await deriveWrappingKey(password, userSalt)
                const userKey = await generateUserKeyFromMnemonic(seedPhrase, userSalt)
                const wrappedKey = await getWrappedKey(userKey, wrappingKey);
                const unWrappedKey = await getUnwrappedKey(wrappedKey, wrappingKey)

                const encryptMnemonicStore = await encryptMnemonic(unWrappedKey, seedPhrase);
                const chain = CHAINS_CONFIG["0x7a69"];
                const provider = new ethers.providers.JsonRpcProvider(chain.rpcUrl);
                const privateKey = ethers.Wallet.fromMnemonic(seedPhrase).privateKey;
                const WalletTemp = new ethers.Wallet(privateKey, provider);
                const contractsData: ContractData[] = [
                    // Add contract ABIs and addresses here
                    {
                        abi: contractsAbi.tabBookmarksAbi,
                        address: CONTRACT_ADDRESS_TabBookMarks,
                        name: "tabBookmarks"
                    },
                    {
                        abi: contractsAbi.customBookmarksAbi,
                        address: CONTRACT_ADDRESS_CUSTOMBookMarks,
                        name: "customBookmarks"
                    },
                    {
                        abi: contractsAbi.personalNotesAbi,
                        address: CONTRACT_ADDRESS_PERSONALNOTES,
                        name: "personalNotes"
                    }
                ];
                const publicKey = WalletTemp?.address;
                const buffer = await window.crypto.subtle.exportKey('raw', wrappingKey);
                const sessionkey = arrayBufferToBase64String(buffer);
                const wrappedKeyString = arrayBufferToBase64String(wrappedKey);
                const userSaltString = uint8ArrayToBase64(userSalt)
                await chrome.storage.local.set({ encryptMnemonicStore, passwordHash, wrappedKeyString, userSalt: userSaltString })
                chrome.storage.session.set({ sessionkey }).then(async () => {
                    const contracts = await getContractInstances(WalletTemp, contractsData);
                    const contractObject = contracts.reduce((acc, contract) => {
                        const name = Object.keys(contract)[0] as ContractName;
                        acc[name] = contract[name];
                        return acc;
                    }, {} as { [k in ContractName]: ethers.Contract });
                    setUnWrappedKey(unWrappedKey)
                    setPublicAddress(publicKey)
                    setWallet(WalletTemp)
                    getAccountTokens(WalletTemp, publicKey)
                    setContractInstances(contractObject)
                    navigate("/wallet")
                })
                return { status: true, message: "Successfully connected with Wallet!" }
            } catch (error) {
                return { status: false, message: "Error in connecting with wallet!" }
            }
        }

    }

    const disconnectWallet = () => {
        chrome.storage.session.remove(["sessionkey"]).then((result) => {
            wallet?.provider.off("block")
            setPublicAddress(undefined)
            setWallet(undefined)
            setContractInstances(null)
            setUnWrappedKey(undefined)
            setPublicAddress(undefined)
            navigate("/")
        }).catch(error => {
            console.log("disconnectWallet", error)
        });
    }

    const userSignIn = async (passphrase: string): Promise<{ status: boolean, message: string }> => {
        // Retrieve the encryptedStore from chrome.storage.local
        const { encryptMnemonicStore, userSalt, wrappedKeyString } = await chrome.storage.local.get(['encryptMnemonicStore', "userSalt", "wrappedKeyString"])
        if (encryptMnemonicStore && userSalt && wrappedKeyString) {
            try {
                let privateKey;
                const userSaltArray = base64ToUint8Array(userSalt)
                const wrappingKey = await deriveWrappingKey(passphrase, userSaltArray)
                const retrievedwrappedKey = base64StringToArrayBuffer(wrappedKeyString);
                const unWrappedKey = await getUnwrappedKey(retrievedwrappedKey, wrappingKey)
                const decryptedMnemonic = await decryptMnemonic(unWrappedKey, encryptMnemonicStore)
                const chain = CHAINS_CONFIG["0x7a69"];
                const provider = new ethers.providers.JsonRpcProvider(chain.rpcUrl);
                if (decryptedMnemonic.split(" ").length === 12) {
                    privateKey = ethers.Wallet.fromMnemonic(decryptedMnemonic).privateKey;
                } else {
                    privateKey = decryptedMnemonic;
                }
                const WalletTemp = new ethers.Wallet(privateKey, provider);
                const contractsData: ContractData[] = [
                    // Add contract ABIs and addresses here
                    {
                        abi: contractsAbi.tabBookmarksAbi,
                        address: CONTRACT_ADDRESS_TabBookMarks,
                        name: "tabBookmarks"
                    },
                    {
                        abi: contractsAbi.customBookmarksAbi,
                        address: CONTRACT_ADDRESS_CUSTOMBookMarks,
                        name: "customBookmarks"
                    },
                    {
                        abi: contractsAbi.personalNotesAbi,
                        address: CONTRACT_ADDRESS_PERSONALNOTES,
                        name: "personalNotes"
                    }
                ];
                const publicKey = WalletTemp?.address;
                const buffers = await window.crypto.subtle.exportKey('raw', wrappingKey);
                const sessionkey = arrayBufferToBase64String(buffers);
                chrome.storage.session.set({ sessionkey }).then(async () => {
                    const contracts = await getContractInstances(WalletTemp, contractsData);
                    const contractObject = contracts.reduce((acc, contract) => {
                        const name = Object.keys(contract)[0] as ContractName;
                        acc[name] = contract[name];
                        return acc;
                    }, {} as { [k in ContractName]: ethers.Contract });
                    setUnWrappedKey(unWrappedKey)
                    setPublicAddress(publicKey)
                    setWallet(WalletTemp)
                    getAccountTokens(WalletTemp, publicKey)
                    setContractInstances(contractObject)
                    navigate("/wallet")
                })
                return { status: true, message: "Sign In Successfully" }
            } catch (error) {
                return { status: false, message: "Error in Sign In, try again!" }
            }
        } else {
            return { status: false, message: "No account found, Create new account!" }
        }

    }

    const isPrivateKeyValid = (privateKey: string) => {
        const validPrivateKeyRegex = /^(0x)?[0-9a-fA-F]{64}$/;

        return validPrivateKeyRegex.test(privateKey);
    }

    const getPrivateKey = async (passphrase: string): Promise<boolean> => {
        const { encryptMnemonicStore, userSalt, wrappedKeyString } = await chrome.storage.local.get(['encryptMnemonicStore', "userSalt", "wrappedKeyString"])
        if (encryptMnemonicStore && userSalt && wrappedKeyString) {
            let privateKey;
            const userSaltArray = base64ToUint8Array(userSalt)
            const wrappingKey = await deriveWrappingKey(passphrase, userSaltArray)
            const retrievedwrappedKey = base64StringToArrayBuffer(wrappedKeyString);
            const unWrappedKey = await getUnwrappedKey(retrievedwrappedKey, wrappingKey)
            const decryptedMnemonic = await decryptMnemonic(unWrappedKey, encryptMnemonicStore)
            if (decryptedMnemonic.split(" ").length === 12) {
                privateKey = ethers.Wallet.fromMnemonic(decryptedMnemonic).privateKey;
            } else {
                privateKey = decryptedMnemonic;
            }

            if (isPrivateKeyValid(privateKey)) {
                return true
            } else {
                return false
            }

        }
        return false

    }

    const getEncryptedString = async (wallet: Wallet, msg: string): Promise<string> => {
        const signature = EthCrypto.sign(
            wallet.privateKey,
            EthCrypto.hash.keccak256(msg)
        );
        const payload = {
            message: msg,
            signature
        };
        const encryptedMsg = await EthCrypto.encryptWithPublicKey(
            wallet.publicKey.substring(2), // by encrypting with bobs publicKey, only bob can decrypt the payload with his privateKey
            JSON.stringify(payload) // we have to stringify the payload before we can encrypt it
        );

        const encryptedString = EthCrypto.cipher.stringify(encryptedMsg);
        const encryptedStringCompressed = EthCrypto.hex.compress(encryptedString, true);
        return encryptedStringCompressed

    }



    const getDcryptedString = async (wallet: Wallet, encryptedString: string): Promise<string> => {
        const encryptedObject = EthCrypto.cipher.parse(encryptedString);
        const decrypted = await EthCrypto.decryptWithPrivateKey(
            wallet.privateKey,
            encryptedObject
        );
        const decryptedPayload = JSON.parse(decrypted);
        // // check signature
        // const senderAddress = EthCrypto.recover(
        //     decryptedPayload.signature,
        //     EthCrypto.hash.keccak256(decryptedPayload.message)
        // );
        return decryptedPayload.message

    }

    // Function to prepare a transaction
    const prepareTransaction = async (contract: ethers.Contract, wallet: Wallet, methodName: string, methodParams: any[]): Promise<ethers.providers.TransactionRequest> => {

        // Prepare the transaction data
        const method = contract.interface.getFunction(methodName);
        const data = contract.interface.encodeFunctionData(method, methodParams);

        // Estimate gas limit
        const estimatedGas = await contract.estimateGas[methodName](...methodParams)

        const gasPriceIncreasePercentage = 1.1; // 10% increase
        // Get the gas price
        const gasPrice = await wallet.provider.getGasPrice();
        const currentNonce = await wallet.provider.getTransactionCount(wallet.address);

        // Create the transaction object
        const transaction: ethers.providers.TransactionRequest = {
            to: contract.address,
            data: data,
            gasLimit: estimatedGas,
            gasPrice: gasPrice
        };
        return transaction;
    }

    // Function to prepare a transaction
    async function prepareTransferTransaction(wallet: Wallet, toAddress: string, amount: string): Promise<ethers.providers.TransactionRequest> {

        // Create the transaction object
        const transaction: ethers.providers.TransactionRequest = {
            to: toAddress,
            value: ethers.utils.parseEther(amount)
        };
        return transaction;
    }

    const getTotalCost = (transaction: ethers.providers.TransactionRequest) => {
        if (transaction && transaction.gasLimit && transaction.gasPrice) {
            const totalCost = parseFloat(transaction.gasLimit.toString()) * parseFloat(transaction.gasPrice.toString())
            const totalCostInETH = ethers.utils.formatEther(totalCost)
            return totalCostInETH
        }
    }

    const transferTokens = async (toAddress: string, amount: string) => {
        if (contractInstances && wallet) {
            setLoadingTransaction(true);
            setShowConfirm(true)
            try {
                const transaction = await prepareTransferTransaction(wallet, toAddress, amount);
                if (transaction) {
                    const totalCost = getTotalCost(transaction);
                    setTransaction({ transaction, method: "Transfer Tokens", totalCost });
                }
                setLoadingTransaction(false);
            } catch (error) {
                setLoadingTransaction(false);
                setShowConfirm(false);
                setTransaction(undefined)
            }
        }
    }

    const getAccountTokens = async (wallet: Wallet, publicAddress: string) => {
        if (wallet && publicAddress) {
            const provider = wallet.provider
            if (provider) {
                setUserBalanceLoading(true)
                try {
                    const balance = await provider.getBalance(publicAddress)
                    const balanceInEth = ethers.utils.formatEther(balance)
                    setUserBalance(parseFloat(balanceInEth))
                    setUserBalanceLoading(false)
                } catch (error) {
                    setUserBalanceLoading(false)
                }
            }
        }
    }



    const createFolder = async (contractName: ContractName, folderName: string, methodName: string) => {
        if (contractInstances && wallet) {
            const contract = contractInstances[contractName];
            const uuid = nanoid()
            const encryptedFolderName = await getEncryptedString(wallet, folderName)
            const folderId = ethers.utils.formatBytes32String(uuid);
            const color = ethers.utils.formatBytes32String("#000000");
            setLoadingTransaction(true);
            setShowConfirm(true)
            try {
                const transaction = await prepareTransaction(contract, wallet, "addFolder", [folderId, encryptedFolderName, color]);
                if (transaction) {
                    const totalCost = getTotalCost(transaction);
                    setTransaction({ transaction, method: methodName, totalCost });
                }
                setLoadingTransaction(false);
            } catch (error) {
                console.log("error", error)
                setLoadingTransaction(false);
                setShowConfirm(false);
                setTransaction(undefined)
            }
        }
    }

    const deleteFolder = async (contractName: ContractName, deltFolderId: string, methodName: string) => {
        if (contractInstances && wallet) {
            const contract = contractInstances[contractName];
            const folderId = ethers.utils.formatBytes32String(deltFolderId);
            setLoadingTransaction(true);
            setShowConfirm(true)
            try {
                const transaction = await prepareTransaction(contract, wallet, "deleteFolder", [folderId]);
                if (transaction) {
                    const totalCost = getTotalCost(transaction);
                    setTransaction({ transaction, method: methodName, totalCost });
                }
                setLoadingTransaction(false);
            } catch (error) {
                setLoadingTransaction(false);
                setShowConfirm(false);
                setTransaction(undefined)
            }
        }
    }

    const updateFolder = async (contractName: ContractName, deltFolderId: string, methodName: string) => {
        if (contractInstances && wallet) {
            const contract = contractInstances[contractName];
            const folderId = ethers.utils.formatBytes32String(deltFolderId);
            const encryptedFolderName = await getEncryptedString(wallet, 'updated name')
            const color = ethers.utils.formatBytes32String("#000000 updated");
            setLoadingTransaction(true);
            setShowConfirm(true)
            try {
                const transaction = await prepareTransaction(contract, wallet, "updateFolder", [folderId, encryptedFolderName, color]);
                if (transaction) {
                    const totalCost = getTotalCost(transaction);
                    setTransaction({ transaction, method: methodName, totalCost });
                }
                setLoadingTransaction(false);
            } catch (error) {
                setLoadingTransaction(false);
                setShowConfirm(false);
                setTransaction(undefined)
            }
        }
    }

    const addTabBookmark = async (folderId: string, url: string, methodName: string) => {
        if (contractInstances && wallet) {
            const tabBookmarks = contractInstances["tabBookmarks"];
            const uuid = nanoid();
            const encryptedUrl = await getEncryptedString(wallet, url)
            const folderIdBytes = ethers.utils.formatBytes32String(folderId);
            const bookmarkId = ethers.utils.formatBytes32String(uuid);
            setLoadingTransaction(true);
            setShowConfirm(true)
            try {
                const transaction = await prepareTransaction(tabBookmarks, wallet, "addBookmark", [folderIdBytes, bookmarkId, encryptedUrl]);
                if (transaction) {
                    const totalCost = getTotalCost(transaction);
                    setTransaction({ transaction, method: methodName, totalCost });
                }
                setLoadingTransaction(false);
            } catch (error) {
                setLoadingTransaction(false);
                setShowConfirm(false);
                setTransaction(undefined)
            }
        }
    }

    const addCustomBookmark = async (folderId: string, url: string, title: string, methodName: string) => {
        if (contractInstances && wallet) {
            const customBookmarks = contractInstances["customBookmarks"];
            const uuid = nanoid();
            const encryptedUrl = await getEncryptedString(wallet, url);
            const encryptedTitle = await getEncryptedString(wallet, title);
            const folderIdBytes = ethers.utils.formatBytes32String(folderId);
            const bookmarkId = ethers.utils.formatBytes32String(uuid);
            setLoadingTransaction(true);
            setShowConfirm(true)
            try {
                const transaction = await prepareTransaction(customBookmarks, wallet, "addBookmark", [folderIdBytes, bookmarkId, encryptedUrl, encryptedTitle]);
                if (transaction) {
                    const totalCost = getTotalCost(transaction);
                    setTransaction({ transaction, method: methodName, totalCost });
                }
                setLoadingTransaction(false);
            } catch (error) {
                setLoadingTransaction(false);
                setShowConfirm(false);
                setTransaction(undefined)
            }
        }
    }

    const addPersonalNote = async (folderId: string, title: string, description: string, methodName: string) => {
        if (contractInstances && wallet) {
            const personalNotes = contractInstances["personalNotes"];
            const uuid = nanoid();
            const encryptedTitle = await getEncryptedString(wallet, title);
            const encryptedDescription = await getEncryptedString(wallet, description);
            const folderIdBytes = ethers.utils.formatBytes32String(folderId);
            const bookmarkId = ethers.utils.formatBytes32String(uuid);
            setLoadingTransaction(true);
            setShowConfirm(true)
            try {
                const transaction = await prepareTransaction(personalNotes, wallet, "addNote", [folderIdBytes, bookmarkId,encryptedTitle, encryptedDescription]);
                if (transaction) {
                    const totalCost = getTotalCost(transaction);
                    setTransaction({ transaction, method: methodName, totalCost });
                }
                setLoadingTransaction(false);
            } catch (error) {
                setLoadingTransaction(false);
                setShowConfirm(false);
                setTransaction(undefined)
            }
        }
    }

    const updateCustomBookmark = async (folderId: string, bookmarkId: string, url: string, title: string, methodName: string) => {
        if (contractInstances && wallet) {
            const customBookmarks = contractInstances["customBookmarks"];
            const encryptedUrl = await getEncryptedString(wallet, url);
            const encryptedTitle = await getEncryptedString(wallet, title);
            const folderIdBytes = ethers.utils.formatBytes32String(folderId);
            const bookmarkIdBytes = ethers.utils.formatBytes32String(bookmarkId);
            setLoadingTransaction(true);
            setShowConfirm(true)
            try {
                const transaction = await prepareTransaction(customBookmarks, wallet, "updateBookmark", [folderIdBytes, bookmarkIdBytes, encryptedUrl, encryptedTitle]);
                if (transaction) {
                    const totalCost = getTotalCost(transaction);
                    setTransaction({ transaction, method: methodName, totalCost });
                }
                setLoadingTransaction(false);
            } catch (error) {
                setLoadingTransaction(false);
                setShowConfirm(false);
                setTransaction(undefined)
            }
        }
    }

    const updatePersonalNote = async (folderId: string, noteId: string, title: string, description: string, methodName: string) => {
        if (contractInstances && wallet) {
            const customBookmarks = contractInstances["personalNotes"];
            const encryptedTitle = await getEncryptedString(wallet, title);
            const encryptedDescription = await getEncryptedString(wallet, description);
            const folderIdBytes = ethers.utils.formatBytes32String(folderId);
            const bookmarkIdBytes = ethers.utils.formatBytes32String(noteId);
            setLoadingTransaction(true);
            setShowConfirm(true)
            try {
                const transaction = await prepareTransaction(customBookmarks, wallet, "updateNote", [folderIdBytes, bookmarkIdBytes, encryptedTitle, encryptedDescription]);
                if (transaction) {
                    const totalCost = getTotalCost(transaction);
                    setTransaction({ transaction, method: methodName, totalCost });
                }
                setLoadingTransaction(false);
            } catch (error) {
                setLoadingTransaction(false);
                setShowConfirm(false);
                setTransaction(undefined)
            }
        }
    }

    const deleteBookmark = async (contractName: ContractName, folderId: string, bookmarkId: string, methodName: string) => {
        if (contractInstances && wallet) {
            const contract = contractInstances[contractName];
            const bytesFolderId = ethers.utils.formatBytes32String(folderId);
            const bytesBookmarkId = ethers.utils.formatBytes32String(bookmarkId);
            setLoadingTransaction(true);
            setShowConfirm(true)
            try {
                const transaction = await prepareTransaction(contract, wallet, "deleteBookmark", [bytesFolderId, bytesBookmarkId]);
                if (transaction) {
                    const totalCost = getTotalCost(transaction);
                    setTransaction({ transaction, method: methodName, totalCost });
                }
                setLoadingTransaction(false);
            } catch (error) {
                setLoadingTransaction(false);
                setShowConfirm(false);
                setTransaction(undefined)
            }
        }
    }

    const deleteNote = async (contractName: ContractName, folderId: string, noteId: string, methodName: string) => {
        if (contractInstances && wallet) {
            const contract = contractInstances[contractName];
            const bytesFolderId = ethers.utils.formatBytes32String(folderId);
            const bytesNoteId = ethers.utils.formatBytes32String(noteId);
            setLoadingTransaction(true);
            setShowConfirm(true)
            try {
                const transaction = await prepareTransaction(contract, wallet, "deleteNote", [bytesFolderId, bytesNoteId]);
                if (transaction) {
                    const totalCost = getTotalCost(transaction);
                    setTransaction({ transaction, method: methodName, totalCost });
                }
                setLoadingTransaction(false);
            } catch (error) {
                setLoadingTransaction(false);
                setShowConfirm(false);
                setTransaction(undefined)
            }
        }
    }

    const moveBookmark = async (contractName: ContractName, fromFolderId: string, toFolderId: string, bookmarkId: string,methodName: string) => {
        if (contractInstances && wallet) {
            const contract = contractInstances[contractName];
            const bytesFromFolderId = ethers.utils.formatBytes32String(fromFolderId);
            const bytesToFolderId = ethers.utils.formatBytes32String(toFolderId);
            const bytesBookmarkId = ethers.utils.formatBytes32String(bookmarkId);
            setLoadingTransaction(true);
            setShowConfirm(true)
            try {
                const transaction = await prepareTransaction(contract, wallet, "moveBookmark", [bytesFromFolderId, bytesToFolderId, bytesBookmarkId])
                if (transaction) {
                    const totalCost = getTotalCost(transaction);
                    setTransaction({ transaction, method: methodName, totalCost });
                }
                setLoadingTransaction(false);
            } catch (error) {
                setLoadingTransaction(false);
                setShowConfirm(false);
                setTransaction(undefined)
            }
        }
    }

    const moveNote = async (contractName: ContractName, fromFolderId: string, toFolderId: string, noteId: string, methodName: string) => {
        if (contractInstances && wallet) {
            const contract = contractInstances[contractName];
            const bytesFromFolderId = ethers.utils.formatBytes32String(fromFolderId);
            const bytesToFolderId = ethers.utils.formatBytes32String(toFolderId);
            const bytesNoteId = ethers.utils.formatBytes32String(noteId);
            setLoadingTransaction(true);
            setShowConfirm(true)
            try {
                const transaction = await prepareTransaction(contract, wallet, "moveNote", [bytesFromFolderId, bytesToFolderId, bytesNoteId])
                if (transaction) {
                    const totalCost = getTotalCost(transaction);
                    setTransaction({ transaction, method: methodName, totalCost });
                }
                setLoadingTransaction(false);
            } catch (error) {
                setLoadingTransaction(false);
                setShowConfirm(false);
                setTransaction(undefined)
            }
        }
    }

    const setAccountActivities = (publicAddress: string, methodName: string, transactionHash: string, status: boolean) => {
        // Retrieve the array from Chrome local storage
        chrome.storage.local.get(publicAddress, function (result) {
            // Check if the "accountActivity" key exists in local storage
            // If it doesn't exist, initialize it as an empty array
            const accountActivityData = result[publicAddress] || [];

            // Create a new object with the method name and transaction hash
            const newActivity = { methodName, transactionHash, status };

            // Add the new object to the front of the array
            accountActivityData.unshift(newActivity);

            // Now, you have the updated array with the new object added at the front

            // Save the updated array back to Chrome local storage
            chrome.storage.local.set({ [publicAddress]: accountActivityData }, function () {
                console.log("");
            });
        });

    }

    const confirmTransaction = async () => {
        if (wallet && transaction && transaction?.transaction && publicAddress) {
            try {
                setShowConfirm(false)
                setStatus('pending')
                const response = await wallet.sendTransaction(transaction?.transaction);
                const receiept = await response.wait();
                if (receiept?.status) {
                    setAccountActivities(publicAddress, transaction.method, receiept?.transactionHash, true)
                    setStatus('confirmed')
                    getAccountTokens(wallet, publicAddress)
                } else {
                    setAccountActivities(publicAddress, transaction.method, receiept?.transactionHash, false)
                    setStatus('failed')
                }
            } catch (error) {
                setStatus('failed')
            }
            setTransaction(undefined)
        }
    }

    const closeConfirmModal = () => {
        setShowConfirm(false)
    }

    const provider = {
        Wallet: wallet,
        publicAddress,
        userBalance,
        userBalanceLoading,
        contractInstances,
        showLoading,
        showConfirm,
        transaction,
        loadingTransaction,
        transferTokens,
        userSignIn,
        getPrivateKey,
        getDcryptedString,
        connectWallet,
        disconnectWallet,
        createFolder,
        deleteFolder,
        updateFolder,
        deleteBookmark,
        deleteNote,
        moveBookmark,
        moveNote,
        closeConfirmModal,
        confirmTransaction,
        status,
        addTabBookmark,
        addCustomBookmark,
        addPersonalNote,
        updateCustomBookmark,
        updatePersonalNote

    }

    return <Web3Context.Provider value={provider}>{children}</Web3Context.Provider>;
};
