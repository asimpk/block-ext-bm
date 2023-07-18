import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Web3Context } from "./Web3Context";
import { CHAINS_CONFIG } from "../../chains";
import { Wallet, ethers } from "ethers";
import EthCrypto from 'eth-crypto';
import { v4 as uuidv4 } from 'uuid';
import { nanoid } from 'nanoid'
import { tabBookmarksAbi } from '../../abis'

import { decryptMnemonic, encryptMnemonic, generateSalt, base64StringToArrayBuffer, arrayBufferToBase64String, generatePasswordHash, generateUserKeyFromMnemonic, deriveWrappingKey, getWrappedKey, getUnwrappedKey, uint8ArrayToBase64, base64ToUint8Array } from "./secure";
import useAddBookmarkBtn from "../../hooks/useAddBookmarkBtn";


interface ContractData {
    abi: any;
    address: string;
}

export const Web3Provider: React.FC<{ children: any }> = ({ children }) => {
    const [wallet, setWallet] = useState<Wallet>()
    const [publicAddress, setPublicAddress] = useState<string>()
    const [unWrappedKey, setUnWrappedKey] = useState<CryptoKey>()
    const [contractInstances, setContractInstances] = useState<ethers.Contract[] | null>(null);
    const [showConfirm, setShowConfirm] = useState(false)
    const [transaction, setTransaction] = useState<{ transaction: ethers.providers.TransactionRequest, method: string }>()
    const [status, setStatus] = useState('idle');
    const [showLoading, setShowLoading] = useState(true)
    const navigate = useNavigate();


    const getContractInstances = async (
        WalletTemp: Wallet,
        contractData: ContractData[]
    ): Promise<ethers.Contract[]> => {
        const contractInstances = await Promise.all(
            contractData.map(async (contract) => {
                const deployedContract = new ethers.Contract(contract.address, contract.abi, WalletTemp);
                return deployedContract;
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
                    setWallet(WalletTemp)
                    const contractsData: ContractData[] = [
                        // Add contract ABIs and addresses here
                        {
                            abi: tabBookmarksAbi,
                            address: '0x5FbDB2315678afecb367f032d93F642f64180aa3'
                        }
                    ];
                    const contracts = await getContractInstances(WalletTemp, contractsData);
                    setContractInstances(contracts)
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
                }, 5000)
            } else {
                setStatus('idle')
            }

        }
    }, [transaction])



    const connectWallet = async (password: string, seedPhrase: string, privateAccount?: string) => {
        if (privateAccount) {
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
            console.log("privateKey1", privateKey)
            const WalletTemp = new ethers.Wallet(privateKey, provider);

            const contractsData: ContractData[] = [
                // Add contract ABIs and addresses here
                {
                    abi: tabBookmarksAbi,
                    address: '0x5FbDB2315678afecb367f032d93F642f64180aa3'
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
                setUnWrappedKey(unWrappedKey)
                setPublicAddress(publicKey)
                setWallet(WalletTemp)
                setContractInstances(contracts)
                navigate("/wallet")
            })
        } else {
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
            console.log("privateKey2", privateKey)
            const WalletTemp = new ethers.Wallet(privateKey, provider);
            const contractsData: ContractData[] = [
                // Add contract ABIs and addresses here
                {
                    abi: tabBookmarksAbi,
                    address: '0x5FbDB2315678afecb367f032d93F642f64180aa3'
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
                setUnWrappedKey(unWrappedKey)
                setPublicAddress(publicKey)
                setWallet(WalletTemp)
                setContractInstances(contracts)
                navigate("/wallet")
            })
        }

    }

    // const connectWallet = async (password: string, seedPhrase: string) => {
    //     const userSalt = await generateSalt(seedPhrase)
    //     const passwordHash = await generatePasswordHash(password, userSalt)
    //     const chain = CHAINS_CONFIG["0x7a69"];
    //     const provider = new ethers.JsonRpcProvider(chain.rpcUrl);
    //     const privateKey = ethers.Wallet.fromPhrase(seedPhrase).privateKey;
    //     const publicKey = ethers.Wallet.fromPhrase(seedPhrase).publicKey;



    //     const WalletTemp = new ethers.Wallet(privateKey, provider);

    //     const signature = EthCrypto.sign(
    //         privateKey,
    //         EthCrypto.hash.keccak256(seedPhrase)
    //     );

    //     console.log("encryptedString1", publicKey, WalletTemp?.signingKey?.publicKey)
    //     const payload = {
    //         message: seedPhrase,
    //         signature
    //     };
    //     const encrypted = await EthCrypto.encryptWithPublicKey(
    //         WalletTemp?.signingKey?.publicKey.substring(2), // by encrypting with bobs publicKey, only bob can decrypt the payload with his privateKey
    //         JSON.stringify(payload) // we have to stringify the payload before we can encrypt it
    //     );
    //     const encryptedString = EthCrypto.cipher.stringify(encrypted);
    //     // // we parse the string into the object again
    //     const encryptedObject = EthCrypto.cipher.parse(encryptedString);

    //     const decrypted = await EthCrypto.decryptWithPrivateKey(
    //         privateKey,
    //         encryptedObject
    //     );
    //     const decryptedPayload = JSON.parse(decrypted);

    //     // // check signature
    //     // const senderAddress = EthCrypto.recover(
    //     //     decryptedPayload.signature,
    //     //     EthCrypto.hash.keccak256(decryptedPayload.message)
    //     // );

    //      // check signature
    //      const senderPublicKey = EthCrypto.recoverPublicKey(
    //         decryptedPayload.signature,
    //         EthCrypto.hash.keccak256(decryptedPayload.message)
    //     );

    //     console.log(
    //         'encryptedString2 ' +
    //         decryptedPayload.message,
    //         senderPublicKey
    //     );

    //     console.log("WalletTemp", WalletTemp, provider)
    // }



    const disconnectWallet = () => {
        chrome && chrome.storage.session.remove(["sessionkey"]).then((result) => {
            setPublicAddress(undefined)
            setWallet(undefined)
            console.log("disconnectWallet", "success")
            navigate("/")
        }).catch(error => {
            console.log("disconnectWallet", "error")
        });
    }

    const userSignIn = async (passphrase: string) => {
        // Retrieve the encryptedStore from chrome.storage.local
        const { encryptMnemonicStore, userSalt, wrappedKeyString } = await chrome.storage.local.get(['encryptMnemonicStore', "userSalt", "wrappedKeyString"])
        if (encryptMnemonicStore && userSalt && wrappedKeyString) {
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

            console.log("privateKeySignIn", privateKey)
            // const privateKey = decryptedMnemonic;
            const WalletTemp = new ethers.Wallet(privateKey, provider);
            const contractsData: ContractData[] = [
                // Add contract ABIs and addresses here
                {
                    abi: tabBookmarksAbi,
                    address: '0x5FbDB2315678afecb367f032d93F642f64180aa3'
                }
            ];
            const publicKey = WalletTemp?.address;
            const buffers = await window.crypto.subtle.exportKey('raw', wrappingKey);
            const sessionkey = arrayBufferToBase64String(buffers);
            chrome.storage.session.set({ sessionkey }).then(async () => {
                const contracts = await getContractInstances(WalletTemp, contractsData);
                setUnWrappedKey(unWrappedKey)
                setPublicAddress(publicKey)
                setWallet(WalletTemp)
                setContractInstances(contracts)
                navigate("/wallet")
            })
        } else {
            console.log("encrypted store not found")
            navigate("/create-account")
        }

    }

    const isPrivateKeyValid = (privateKey: string) => {
        const validPrivateKeyRegex = /^(0x)?[0-9a-fA-F]{64}$/;

        return validPrivateKeyRegex.test(privateKey);
    }

    const getPrivateKey = async (passphrase: string): Promise<boolean> => {
        // Retrieve the encryptedStore from chrome.storage.local
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

    const encryptMessages = async () => {
        if (unWrappedKey && wallet) {
            const signature1 = EthCrypto.sign(
                wallet?.privateKey,
                EthCrypto.hash.keccak256("before first messages with")
            );
            const payload1 = {
                message: "first message",
                signature1
            };
            const encrypted1 = await EthCrypto.encryptWithPublicKey(
                wallet.publicKey.substring(2), // by encrypting with bobs publicKey, only bob can decrypt the payload with his privateKey
                JSON.stringify(payload1) // we have to stringify the payload before we can encrypt it
            );
            const signature2 = EthCrypto.sign(
                wallet?.privateKey,
                EthCrypto.hash.keccak256("second msg second msg second msg second msg second msg second msg second msg second msg second msg second msg second msg")
            );
            const payload2 = {
                message: "second msg second msg second msg second msg second msg second msg second msg second msg second msg second msg second msg",
                signature2
            };
            const encrypted2 = await EthCrypto.encryptWithPublicKey(
                wallet.publicKey.substring(2), // by encrypting with bobs publicKey, only bob can decrypt the payload with his privateKey
                JSON.stringify(payload2) // we have to stringify the payload before we can encrypt it
            );
            const encryptedString1 = EthCrypto.cipher.stringify(encrypted1);
            const encryptedString2 = EthCrypto.cipher.stringify(encrypted2);

            console.log("encryptedStringLength", encryptedString1.length, encryptedString2.length)
            await chrome.storage.local.set({ firstMsg: encryptedString1 })
        }

    }

    const decryptMessages = async () => {
        if (unWrappedKey && wallet) {
            const result = await chrome.storage.local.get(["firstMsg"])
            const { firstMsg } = result
            await chrome.storage.local.set({ firstMsg })
            if (firstMsg) {
                const encryptedObject = EthCrypto.cipher.parse(firstMsg);

                const decrypted = await EthCrypto.decryptWithPrivateKey(
                    wallet?.privateKey,
                    encryptedObject
                );
                const decryptedPayload = JSON.parse(decrypted);

                // // check signature
                // const senderAddress = EthCrypto.recover(
                //     decryptedPayload.signature,
                //     EthCrypto.hash.keccak256(decryptedPayload.message)
                // );

                console.log("Decrupted msgz for", decryptedPayload.message)
            }
        }
    }

    // Function to prepare a transaction
    async function prepareTransaction(contract: ethers.Contract, wallet: Wallet, methodName: string, methodParams: any[]): Promise<ethers.providers.TransactionRequest> {


        // Prepare the transaction data
        const method = contract.interface.getFunction(methodName);
        const data = contract.interface.encodeFunctionData(method, methodParams);

        // Estimate gas limit
        const estimatedGas = await contract.estimateGas[methodName](...methodParams);

        // Get the gas price
        const gasPrice = await wallet.provider.getGasPrice();

        // Create the transaction object
        const transaction: ethers.providers.TransactionRequest = {
            to: contract.address,
            data: data,
            gasLimit: estimatedGas,
            gasPrice: gasPrice,
        };

        return transaction;
    }



    const createFolder = async (folderName: string) => {
        if (contractInstances && wallet) {
            const [tabBookmarks] = contractInstances;
            const uuid = nanoid()
            const folderId = ethers.utils.formatBytes32String(uuid);
            const name = ethers.utils.formatBytes32String(folderName);
            const color = ethers.utils.formatBytes32String("#000000");
            const transaction = await prepareTransaction(tabBookmarks, wallet, "createFolder", [folderId, name, color])
            if (transaction) {
                setTransaction({ transaction, method: "Create Folder" });
                setShowConfirm(true)
            }
        }
    }

    const deleteFolder = async (deltFolderId: string) => {
        if (contractInstances && wallet) {
            const [tabBookmarks] = contractInstances;
            const folderId = ethers.utils.formatBytes32String(deltFolderId);
            const transaction = await prepareTransaction(tabBookmarks, wallet, "deleteFolder", [folderId])
            if (transaction) {
                setTransaction({ transaction, method: "Delete Folder" });
                setShowConfirm(true)
            }
        }
    }

    const updateFolder = async (deltFolderId: string) => {
        if (contractInstances && wallet) {
            const [tabBookmarks] = contractInstances;
            const folderId = ethers.utils.formatBytes32String(deltFolderId);
            const name = ethers.utils.formatBytes32String('updated name');
            const color = ethers.utils.formatBytes32String("#000000 updated");
            const transaction = await prepareTransaction(tabBookmarks, wallet, "updateFolder", [folderId, name, color])
            if (transaction) {
                setTransaction({ transaction, method: "Update Folder" });
                setShowConfirm(true)
            }
        }
    }

    const addBookmark = async (folderId: string, urlVal: string) => {
        if (contractInstances && wallet) {
            const [tabBookmarks] = contractInstances;
            const uuid = nanoid()
            const folderIdBytes = ethers.utils.formatBytes32String(folderId);
            const bookmarkId = ethers.utils.formatBytes32String(uuid);
            const transaction = await prepareTransaction(tabBookmarks, wallet, "addBookmark", [folderIdBytes, bookmarkId, urlVal])
            if (transaction) {
                setTransaction({ transaction, method: "Add Bookmark" });
                setShowConfirm(true)
            }
        }
    }

    const setAccountActivities = (publicAddress: string, methodName: string, transactionHash: string, status: boolean) => {
        // Retrieve the array from Chrome local storage
        console.log("setAccountActivities", publicAddress)
        chrome.storage.local.get(publicAddress, function (result) {
            // Check if the "accountActivity" key exists in local storage
            // If it doesn't exist, initialize it as an empty array
            const accountActivityData = result[publicAddress] || [];

            // Create a new object with the method name and transaction hash
            const newActivity = { methodName, transactionHash, status };

            // Add the new object to the front of the array
            accountActivityData.unshift(newActivity);

            // Now, you have the updated array with the new object added at the front
            console.log(accountActivityData);

            // Save the updated array back to Chrome local storage
            chrome.storage.local.set({ [publicAddress]: accountActivityData }, function () {
                console.log("Data saved successfully!");
            });
        });

    }

    const confirmTransaction = async () => {
        if (wallet && transaction && transaction?.transaction && publicAddress) {
            setShowConfirm(false)
            setStatus('pending')
            const response = await wallet.sendTransaction(transaction?.transaction);
            const receiept = await response.wait();
            if (receiept?.status) {
                console.log("confirmTransaction", receiept, response, transaction);
                setAccountActivities(publicAddress, transaction.method, receiept?.transactionHash, true)
                setStatus('confirmed')
            } else {
                setAccountActivities(publicAddress, transaction.method, receiept?.transactionHash, false)
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
        contractInstances,
        showLoading,
        showConfirm,
        userSignIn,
        getPrivateKey,
        connectWallet,
        disconnectWallet,
        encryptMessages,
        decryptMessages,
        createFolder,
        deleteFolder,
        updateFolder,
        closeConfirmModal,
        confirmTransaction,
        status,
        addBookmark,

    }

    return <Web3Context.Provider value={provider}>{children}</Web3Context.Provider>;
};
