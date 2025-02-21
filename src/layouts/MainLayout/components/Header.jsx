import { ExternalLink } from 'lucide-react';
import { shortenAddress } from '../../../lib/utils';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import { contractAddr } from '../../../contracts/contractData';
import Button from '../../../components/Button';

const Header = () => {
    const { open } = useAppKit();
    const { address, isConnected } = useAppKitAccount();

    return (
        <header className="py-3 border-b">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold">CrowdFunding</h1>
                    <a
                        className="flex items-center text-sm hover:bg-gray-200 p-1 rounded-4xl transition-colors gap-1 translate-y-0.5"
                        target="_blank"
                        href={`https://sepolia.etherscan.io/address/${contractAddr}`}
                    >
                        {shortenAddress(contractAddr)}
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
                <Button onClick={() => open()}>
                    {isConnected ? shortenAddress(address) : 'Connect Wallet'}
                </Button>
            </div>
        </header>
    );
};

export default Header;
