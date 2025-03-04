import { useStateContext } from '../../../context';
import { Button } from '../../../components';

const Header = () => {
    const {
        open,
        address,
        contractAddress,
        isConnected,
        shortenAddress,
        getContractAddress,
        ExternalLink,
    } = useStateContext();

    return (
        <header className="py-3 border-b">
            <div className="flex justify-between items-center gap-2">
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">CrowdFunding</h1>
                    <a
                        className="flex items-center rounded-[12px] px-2 py-1 hover:bg-gray-200 translate-y-[2px] gap-1"
                        href={`https://sepolia.etherscan.io/address/${contractAddress}`}
                        target="_blank"
                    >
                        {shortenAddress(getContractAddress(contractAddress))}
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </div>

                <Button handleClick={() => open()}>
                    {isConnected
                        ? `${shortenAddress(getContractAddress(address))}`
                        : 'Connect Wallet'}
                </Button>
            </div>
        </header>
    );
};

export default Header;
