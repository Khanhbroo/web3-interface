import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export const shortenAddress = (address, startLength = 5, endLength = 5) => {
    if (address) {
        const start = address.substring(0, startLength + 2);
        const end = address.substring(address.length - endLength);
        return `${start}...${end}`;
    } else return undefined;
};

export const cn = (...className) => {
    return twMerge(clsx(className));
};
