import { cn } from '../lib/utils';

const Card = ({ children, className }) => {
    return (
        <div
            className={cn(
                'p-4 border shadow-lg rounded-lg space-y-1',
                className,
            )}
        >
            {children}
        </div>
    );
};

export default Card;
