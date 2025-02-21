import { useState, useEffect } from 'react';
import { createAppKit, useAppKitProvider } from '@reown/appkit/react';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';
import {
    // ethers,
    BrowserProvider,
    Contract,
    formatEther,
    AlchemyProvider,
} from 'ethers';
import { sepolia } from '@reown/appkit/networks';

import { contractAddr, contractABI } from './contracts/contractData';
import { MainLayout } from './layouts/MainLayout';
import Card from './components/Card';
import FundCard from './components/FundCard';
import { LoaderCircle } from 'lucide-react';
import { shortenAddress } from './lib/utils';

// Get projectId
const projectId = import.meta.env.VITE_WALLET_CONNECT_ID;
// const rpcUrl = import.meta.env.VITE_ETH_SEPOLIA_RPC_URL;

// Set the networks
const networks = [sepolia];

// const sepoliaNetwork = {
//     chainId: 11155111,
//     name: 'Ethereum Sepolia',
//     currency: 'ETH',
//     explorerUrl: 'https://sepolia.etherscan.io',
//     rpcUrl,
// };

// Create a metadata object - optional
const metadata = {
    name: 'CrowdFunding Interface',
    description: 'My website helps user using CrowdFunding contract',
    url: 'https://mywebsite.com', // origin must match your domain & subdomain
    icons: ['https://avatars.mywebsite.com/'],
};

// const customProvider = new ethers.JsonRpcProvider(rpcUrl);
// const ethersAdapter = new EthersAdapter({ provider: customProvider });

// Create a AppKit instance
createAppKit({
    adapters: [new EthersAdapter()],
    networks,
    metadata,
    projectId,
    features: {
        analytics: true, // Optional - defaults to your Cloud configuration
    },
    // defaultNetwork: sepoliaNetwork,
});

function App() {
    const { walletProvider } = useAppKitProvider('eip155');
    const [isLoading, setIsLoading] = useState(true);
    const [crowdFundingBal, setCrowdFundingBal] = useState();
    const [funderLength, setFunderLength] = useState();
    const [funderInfo, setFunderInfo] = useState([]);

    const fetchContractData = async () => {
        setIsLoading(true);
        try {
            let ethersProvider;
            if (walletProvider) {
                ethersProvider = new BrowserProvider(walletProvider);
            } else {
                ethersProvider = new AlchemyProvider(
                    'sepolia',
                    import.meta.env.VITE_ALCHEMY_SEPOLIA_KEY,
                );
            }

            const contract = new Contract(
                contractAddr,
                contractABI,
                ethersProvider,
            );
            const contractBalance =
                await ethersProvider.getBalance(contractAddr);
            const responseFunderLength = await contract.getFunderLength();

            const funders = [];
            for (let i = 0; i < responseFunderLength; i++) {
                const userAddress = await contract.s_funders(i);
                const userAmount =
                    await contract.s_addressToUsdAmount(userAddress);
                if (!funders.some((funder) => funder.address === userAddress)) {
                    const funderObj = {
                        address: userAddress,
                        amount: formatEther(userAmount), // Convert BigNumber to string if needed
                    };
                    funders.push(funderObj);
                }
            }
            funders.sort((a, b) => b.amount - a.amount);

            setFunderInfo(funders);
            setCrowdFundingBal(formatEther(contractBalance));
            setFunderLength(parseInt(responseFunderLength));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchContractData();
    }, [walletProvider]);

    return (
        <div className="wrapper">
            <MainLayout>
                <div className="flex justify-start items-center gap-2 pt-4">
                    <div className="w-[30%] space-y-2">
                        <Card>
                            <h2 className="text-lg font-semibold">
                                Total Amount Funding
                            </h2>
                            {isLoading && (
                                <LoaderCircle className="animate-spin" />
                            )}
                            {!isLoading && crowdFundingBal && (
                                <p className="text-3xl font-bold">
                                    {crowdFundingBal}{' '}
                                    <span className="text-base">ETH</span>
                                </p>
                            )}
                        </Card>
                        <Card>
                            <h2 className="text-lg font-semibold">Funders</h2>
                            {isLoading && (
                                <LoaderCircle className="animate-spin" />
                            )}
                            {!isLoading && funderLength && (
                                <p className="text-3xl font-bold">
                                    {funderLength}
                                </p>
                            )}
                        </Card>
                    </div>
                    <FundCard fetch={fetchContractData} />
                </div>

                <div className="mt-6 pt-6 border-t space-y-4">
                    <h2 className="text-lg font-semibold">Most Donation</h2>
                    {isLoading && <LoaderCircle className="animate-spin" />}
                    {!isLoading &&
                        funderInfo.length !== 0 &&
                        funderInfo.map((funder, index) => (
                            <>
                                <Card
                                    key={index}
                                    className="flex justify-between gap-2 shadow-none hover:shadow-lg transition-all"
                                >
                                    <div className="flex items-center">
                                        <p className="text-sm font-semibold">
                                            {index + 1}
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-semibold">
                                            Funders
                                        </p>
                                        <a
                                            className="hover:underline"
                                            href={`https://sepolia.etherscan.io/address/${funder.address}`}
                                            target="_blank"
                                        >
                                            {shortenAddress(funder.address)}
                                        </a>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-semibold">
                                            Value
                                        </p>
                                        <p>
                                            {Number(funder.amount).toFixed(2)}{' '}
                                            ETH
                                        </p>
                                    </div>
                                </Card>
                            </>
                        ))}
                </div>
            </MainLayout>
        </div>
    );
}

export default App;
