import { useState } from 'react';
import { useAppKitProvider } from '@reown/appkit/react';
import { BrowserProvider, Contract, parseEther } from 'ethers';

import Card from '../components/Card';
import { contractAddr, contractABI } from '../contracts/contractData';
import Button from './Button';
import {
    LoaderCircle,
    Youtube,
    Facebook,
    Github,
    HandCoins,
} from 'lucide-react';
import { shortenAddress } from '../lib/utils';

const FundCard = ({ fetch }) => {
    const { walletProvider } = useAppKitProvider('eip155');
    const [isLoading, setIsLoading] = useState(false);
    const [amountFund, setAmountFund] = useState();
    const [txHash, setTxHash] = useState();

    const onInputAmountChange = (e) => {
        setAmountFund(parseFloat(e.target.value));
    };

    const handleFundToCrowdFunding = async () => {
        setIsLoading(true);
        try {
            if (!amountFund || amountFund <= 0) {
                alert('Amount Funding Invalid');
                return;
            }

            if (walletProvider) {
                const ethersProvider = new BrowserProvider(walletProvider);
                const signer = await ethersProvider.getSigner();
                const contract = new Contract(
                    contractAddr,
                    contractABI,
                    signer,
                );
                const tx = await contract.fund({
                    value: parseEther(String(amountFund)),
                });

                setTxHash(tx.hash);

                await tx.wait();
                fetch();
            }
        } catch (error) {
            alert('Fund To Crowd Funding Error!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-[70%] py-8 space-y-2">
            {!isLoading && (
                <div className="flex justify-between items-center">
                    <div>
                        <div className="flex gap-4 py-3 m-1.5">
                            <a
                                className="p-1 rounded-4xl bg-slate-900 text-sm text-white hover:bg-slate-00 cursor-pointer transition-colors"
                                href=""
                                target="_blank"
                            >
                                <Youtube className="w-8 h-8 p-1" />
                            </a>
                            <a
                                className="p-1 rounded-4xl bg-slate-900 text-sm text-white hover:bg-slate-00 cursor-pointer transition-colors"
                                href="https://www.facebook.com/khanhdq1120"
                                target="_blank"
                            >
                                <Facebook className="w-8 h-8 p-0.5" />
                            </a>
                            <a
                                className="p-1 rounded-4xl bg-slate-900 text-sm text-white hover:bg-slate-00 cursor-pointer transition-colors"
                                href="https://github.com/Khanhbroo"
                                target="_blank"
                            >
                                <Github className="w-8 h-8 p-1" />
                            </a>
                        </div>
                        <h2 className="text-lg font-semibold">
                            Donate your Ether
                        </h2>
                        <div className="space-x-2">
                            <input
                                className="border p-2 rounded-lg"
                                type="number"
                                placeholder="Amount"
                                onChange={onInputAmountChange}
                            />

                            <Button onClick={handleFundToCrowdFunding}>
                                Fund
                            </Button>
                        </div>
                    </div>
                    <div className="mr-4">
                        <HandCoins className="w-30 h-30 text-slate-200" />
                    </div>
                </div>
            )}

            {isLoading && (
                <div className="space-y-4 mb-2">
                    <div className="flex items-center gap-2">
                        <LoaderCircle className="w-8 h-8 animate-spin" />
                        <span>Transaction is pending...</span>
                    </div>
                    {txHash && (
                        <>
                            <span>Transaction : </span>
                            <a
                                className="cursor-pointer hover:underline"
                                href={`https://sepolia.etherscan.io/tx/${txHash}`}
                                target="_blank"
                            >
                                {shortenAddress(txHash)}
                            </a>
                        </>
                    )}
                </div>
            )}
        </Card>
    );
};

export default FundCard;
