import { useStateContext } from '../context';
import { cn } from '../lib/utils';

const Card = ({
    headingContent,
    paraContent,
    span,
    onlyChildren,
    children,
    className,
}) => {
    const { isLoading, LoaderCircle } = useStateContext();
    return (
        <div
            className={cn(
                'p-4 border shadow-lg rounded-lg space-y-1',
                className,
            )}
        >
            {/* Check if there is no onlyChildren, isLoading equals false and paraContent is a truthy then display the content of paraContent */}
            {!onlyChildren && (
                <div>
                    <h2 className="text-lg font-semibold">{headingContent}</h2>
                    {isLoading && (
                        <div className="py-[6px]">
                            <div className="flex items-center gap-2">
                                <LoaderCircle className="animate-spin" />
                                <p className="text-sm">
                                    You need to connect your wallet first
                                </p>
                            </div>
                        </div>
                    )}
                    {!isLoading && paraContent && (
                        <p className="text-3xl font-bold">
                            {paraContent}{' '}
                            {span && <span className="text-base">{span}</span>}
                        </p>
                    )}
                </div>
            )}
            {children}
        </div>
    );
};

export default Card;
