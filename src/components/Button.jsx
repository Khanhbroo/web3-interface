import { cn } from '../lib/utils';

const Button = ({ children, className, onClick }) => {
    return (
        <button
            className={cn(
                'py-2 px-3 rounded-4xl bg-slate-900 text-sm text-white hover:bg-slate-800 cursor-pointer transition-colors',
                className,
            )}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default Button;
