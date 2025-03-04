import { cn } from '../lib/utils';

const Button = ({ className, children, handleClick }) => {
    return (
        <button
            className={cn(
                'bg-slate-900 text-white rounded-[16px] px-3 py-2 hover:bg-slate-800 transition-colors cursor-pointer',
                className,
            )}
            onClick={handleClick}
        >
            {children}
        </button>
    );
};

export default Button;
