import { useEffect } from 'react';
import { useStateContext } from './context';
import { MainLayout } from './layouts/MainLayout';
import { Card, FundCard } from './components';
import { shortenAddress } from './lib/utils';

const App = () => {
    const {
        walletProvider,
        fetchContractData,
        crowdFundingBalance,
        funderLength,
        getContractAddress,
        historyEvents,
        isLoading,
        LoaderCircle,
    } = useStateContext();

    useEffect(() => {
        fetchContractData();
    }, [walletProvider]);

    return (
        <MainLayout>
            {/* Main Part */}
            <div className="pt-4">
                <div className="flex justify-start items-centers gap-4">
                    <div className="w-[30%] space-y-2">
                        <Card
                            headingContent="Total Amount Funded"
                            paraContent={crowdFundingBalance}
                            span="ETH"
                        />

                        <Card
                            headingContent="Funders"
                            paraContent={funderLength}
                        />
                    </div>
                    <div className="w-[70%] p-4 border shadow-lg rounded-lg">
                        <FundCard />
                    </div>
                </div>
            </div>
            <div className="mt-6 pt-6 border-t space-y-5">
                <h2 className="text-lg font-semibold mt-2">Latest Donation</h2>
                {isLoading && (
                    <div className="flex items-center gap-2">
                        <LoaderCircle className="animate-spin" />
                        <p className="text-sm">
                            You need to connect your wallet first
                        </p>
                    </div>
                )}
                {!isLoading &&
                    historyEvents &&
                    historyEvents.map((item, index) => (
                        <Card
                            key={item.txHash}
                            onlyChildren
                            className="shadow-none flex justify-between gap-2 hover:shadow-lg transition-all"
                        >
                            <div className="flex items-center">
                                <p className="text-sm font-semibold">
                                    {index + 1}
                                </p>
                            </div>
                            <div className="flex flex-col justify-center items-center ml-[-25%]">
                                <p className="text-sm font-semibold">Funder</p>
                                <a
                                    className="cursor-pointer hover:underline"
                                    href={`https://sepolia.etherscan.io/address/${item.funder}`}
                                    target="_blank"
                                >
                                    {shortenAddress(
                                        getContractAddress(item.funder),
                                    )}
                                </a>
                            </div>
                            <div className="flex flex-col justify-center items-center">
                                <p className="text-sm font-semibold">Value</p>
                                <p>{item.value} ETH</p>
                            </div>
                            <div className="flex flex-col justify-center items-center">
                                <p className="text-sm font-semibold">TxHash</p>
                                <a
                                    className="cursor-pointer hover:underline"
                                    href={`https://sepolia.etherscan.io/tx/${item.txHash}`}
                                    target="_blank"
                                >
                                    {shortenAddress(item.txHash)}
                                </a>
                            </div>
                        </Card>
                    ))}
            </div>
        </MainLayout>
    );
};

export default App;
