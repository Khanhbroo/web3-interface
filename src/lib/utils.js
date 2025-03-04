import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

export const shortenAddress = (address, startLength = 5, endLength = 5) => {
    if (address) {
        const startAddress = address.slice(0, startLength);
        const endAddress = address.slice(address.length - endLength);
        return `${startAddress}...${endAddress}`;
    }
    return undefined;
};

export const cn = (...className) => {
    return twMerge(clsx(className));
};
