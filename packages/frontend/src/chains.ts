type ChainType = {
    hex: string,
    name: string,
    rpcUrl: string,
    ticker: string
}
const Ethereum: ChainType = {
    hex: '0x1',
    name: 'Ethereum',
    rpcUrl: '',
    ticker: "ETH"
};

const LocalHost: ChainType = {
    hex: '0x7a69',
    name: 'LocalHost',
    rpcUrl: 'http://127.0.0.1:8545/',
    ticker: "ETH"
};

const MumbaiTestnet: ChainType = {
    hex: '0x13881',
    name: 'Mumbai Testnet',
    rpcUrl: '',
    ticker: "MATIC"
};

export const CHAINS_CONFIG: { [key: string]: ChainType } = {
    "0x1": Ethereum,
    "0x13881": MumbaiTestnet,
    "0x7a69": LocalHost
};