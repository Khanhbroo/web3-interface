import { createContext, useContext, useState } from 'react';
import {
    createAppKit,
    useAppKit,
    useAppKitAccount,
    useAppKitProvider,
} from '@reown/appkit/react';
import {
    BrowserProvider,
    Contract,
    formatEther,
    parseEther,
    ethers,
    AlchemyProvider,
} from 'ethers';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';
import { sepolia } from '@reown/appkit/networks';

import { contractAddress, contractABI } from '../contracts/contractData';
import {
    ExternalLink,
    LoaderCircle,
    HandCoins,
    Youtube,
    Facebook,
    Github,
} from 'lucide-react';
import { shortenAddress } from '../lib/utils';

// Create a new context for whole project
const StateContext = createContext();

// Get projectId
const projectId = import.meta.env.VITE_PROJECT_ID;

// Set the networks
const networks = [sepolia];

// Create a metadata object - optional
const metadata = {
    name: 'My CrowdFunding Website',
    description: 'This crowd funding website will help create a campaign',
    url: 'https://mywebsite.com',
    icons: ['https://avatars.mywebsite.com/'],
};

// Create a AppKit instance
createAppKit({
    adapters: [new EthersAdapter()],
    networks,
    metadata,
    projectId,
    features: {
        analytics: true,
    },
});

export const StateContextProvider = ({ children }) => {
    const { open } = useAppKit();
    const { address, isConnected } = useAppKitAccount();
    const { walletProvider } = useAppKitProvider('eip155');
    const [crowdFundingBalance, setCrowdFundingBalance] = useState();
    const [funderLength, setFunderLength] = useState();
    const [amountFund, setAmountFund] = useState('');
    const [txHash, setTxHash] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [historyEvents, setHistoryEvents] = useState();

    const fetchContractData = async () => {
        setIsLoading(true);
        try {
            let ethersProvider;

            if (walletProvider) {
                ethersProvider = new BrowserProvider(walletProvider);
            } else {
                ethersProvider = new AlchemyProvider(
                    'sepolia',
                    import.meta.env.VITE_SEPOLIA_RPC_URL,
                );
            }

            // Read contract
            const contract = new Contract(
                contractAddress,
                contractABI,
                ethersProvider,
            );
            const contractBalance =
                await ethersProvider.getBalance(contractAddress);
            const responseFunderLength = await contract.getFunderLength();

            // Filter the contract to get Events
            const fundedEventFormated = []; // Use for collecting event object
            const fundedFilter = contract.filters.Funded;
            const fundedEvent = await contract.queryFilter(fundedFilter, 10000);
            // Push a new object including blockNumber, transactionHash, funderAddress and fundedAmount to array
            for (let i = 0; i < fundedEvent.length; i++) {
                const currentEvent = fundedEvent[i];
                const eventObj = {
                    blockNumber: currentEvent.blockNumber,
                    txHash: currentEvent.transactionHash,
                    funder: currentEvent.args[0],
                    value: formatEther(currentEvent.args[1]),
                };
                fundedEventFormated.push(eventObj);
            }
            fundedEventFormated.sort((a, b) => b.blockNumber - a.blockNumber);

            setCrowdFundingBalance(formatEther(contractBalance));
            setFunderLength(parseInt(responseFunderLength));
            setHistoryEvents(fundedEventFormated);
            setAmountFund('');
        } finally {
            setIsLoading(false);
        }
    };

    // Write Contract
    const handleFundToCrowdFunding = async () => {
        setIsLoading(true);
        if (!isConnected) {
            alert('Connect Your Wallet First!');
            setIsLoading(false);
        } else if (isNaN(amountFund) || !amountFund || amountFund <= 0) {
            alert('Amount Funding Invalid');
            setIsLoading(false);
            return;
        }

        try {
            if (walletProvider) {
                const ethersProvider = new BrowserProvider(walletProvider);
                const signer = await ethersProvider.getSigner();
                const contract = new Contract(
                    contractAddress,
                    contractABI,
                    signer,
                );
                const tx = await contract.fund({
                    value: parseEther(amountFund),
                });

                setTxHash(tx.hash);

                await tx.wait();
                fetchContractData();
            }
        } catch (error) {
            if (
                error.code === 'CALL_EXCEPTION' &&
                error.reason === 'Insufficient Fund'
            ) {
                alert('Insufficient Fund');
            } else {
                // Handle other errors (e.g., network issues, insufficient ETH)
                alert('Funding failed: ' + error.message);
            }
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputAmountChange = (e) => {
        setAmountFund(e.target.value);
    };

    // Ensure checksummed address
    const getContractAddress = (contractAddr) => {
        return ethers.getAddress(contractAddr);
    };

    return (
        <StateContext.Provider
            value={{
                open,
                address,
                isConnected,
                contractAddress,
                contractABI,
                walletProvider,
                crowdFundingBalance,
                funderLength,
                amountFund,
                fetchContractData,
                isLoading,
                txHash,
                handleFundToCrowdFunding,
                handleInputAmountChange,
                shortenAddress,
                getContractAddress,
                historyEvents,
                ExternalLink,
                LoaderCircle,
                HandCoins,
                Youtube,
                Facebook,
                Github,
            }}
        >
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
