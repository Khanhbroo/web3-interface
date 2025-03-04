import { useStateContext } from '../context';
import { Button, Card } from '../components';
import { shortenAddress } from '../lib/utils';

const FundCard = () => {
    const {
        isLoading,
        amountFund,
        txHash,
        handleInputAmountChange,
        handleFundToCrowdFunding,
        LoaderCircle,
        HandCoins,
        Youtube,
        Facebook,
        Github,
    } = useStateContext();

    return (
        <div className="flex items-center justify-between">
            <Card
                onlyChildren
                className="border-0 shadow-none rounded-none p-[8px]"
            >
                <div className="flex gap-5">
                    <a
                        className="p-2 bg-black rounded-full text-white cursor-pointer hover:opacity-80 transition-all"
                        href="https://www.facebook.com/khanhdq1120"
                        target="_blank"
                    >
                        <Facebook />
                    </a>
                    <a
                        className="p-2 bg-black rounded-full text-white cursor-pointer hover:opacity-80 transition-all"
                        href="https://github.com/Khanhbroo"
                        target="_blank"
                    >
                        <Github />
                    </a>
                    <a
                        className="p-2 bg-black rounded-full text-white cursor-pointer hover:opacity-80 transition-all"
                        href="https://www.youtube.com/@Khanhbroo"
                        target="_blank"
                    >
                        <Youtube />
                    </a>
                </div>
                <h2 className="mt-[12px] text-[24px] py-2 font-semibold">
                    Donate Your Ether
                </h2>
                {isLoading && (
                    <>
                        <div className="flex justify-start items-center space-x-2">
                            <LoaderCircle className="animate-spin w-8 h-8" />
                            <span>Transactions is pending...</span>
                        </div>
                        {txHash && (
                            <p className="mt-[20px]">
                                Transation Hash:{' '}
                                <a
                                    className="cursor-pointer hover:underline"
                                    href={`https://sepolia.etherscan.io/tx/${txHash}`}
                                    target="_blank"
                                >
                                    {shortenAddress(txHash)}
                                </a>
                            </p>
                        )}
                    </>
                )}
                {!isLoading && (
                    <div className="space-x-2">
                        <input
                            className="border p-2 rounded-lg"
                            placeholder="Amount"
                            type="number"
                            step="0.01"
                            min="0"
                            value={amountFund}
                            onChange={(e) => handleInputAmountChange(e)}
                        />

                        <Button handleClick={handleFundToCrowdFunding}>
                            Fund
                        </Button>
                    </div>
                )}
            </Card>
            <HandCoins className="opacity-20 w-32 h-32 mr-3" />
        </div>
    );
};

export default FundCard;
