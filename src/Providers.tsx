import * as React from 'react';

export interface ProvidersProps {
    providers: React.ReactElement[] | React.ReactElement;
    children: React.ReactNode;
}
const Providers: React.FC<ProvidersProps> = ({ providers, children }) => {
    const providersArray =
        Array.isArray(providers) ?
        providers :
        React.Children.toArray(providers.props.children);
    const wrapChildrenWithProviderElement =
        (children: React.ReactNode, providerElement: React.ReactElement) =>
            React.cloneElement(providerElement, undefined, children);
    return <>{providersArray.reduceRight(wrapChildrenWithProviderElement, children)}</>;
};

export default Providers;
