import * as React from 'react';

export function joinContext<T extends React.Context<any>[]>(contexts: T): React.Context<ContextValues<T>> {
    return {
        Provider: joinProvider(contexts),
        Consumer: joinConsumer(contexts),
    };
}

export function joinProvider<T extends React.Context<any>[]>(contexts: T): React.Provider<ContextValues<T>> {
    return ({ value, children }) => {
        const items = zip(contexts, value as any);
        return items.reduce<React.ReactElement<any> | null>((prev, curr) => {
            const [ context, value ] = curr;
            const { Provider } = context as React.Context<any>;
            return <Provider value={value}>{ prev || children }</Provider>;
        }, null);
    };
}

export function joinConsumer<T extends React.Context<any>[]>(contexts: T): React.Consumer<ContextValues<T>> {
    return ({ children }) => {
        return (contexts.reduce<React.ReactNode>((prev, curr) => {
            const { Consumer } = curr;
            return (values: any) => <Consumer>{ value => (prev as any || children)([value, ...values]) }</Consumer>;
        }, null) as any)([]);
    };
}

export type ContextValue<T> =
    T extends React.Context<infer V> ? V :
    T extends React.Provider<infer V> ? V :
    T extends React.Consumer<infer V> ? V :
    any;

export type ContextValues<T> =
    T extends [infer A] ? [ContextValue<A>] :
    T extends [infer A, infer B] ? [ContextValue<A>, ContextValue<B>] :
    T extends [infer A, infer B, infer C] ? [ContextValue<A>, ContextValue<B>, ContextValue<C>] :
    T extends [infer A, infer B, infer C, infer D] ? [ContextValue<A>, ContextValue<B>, ContextValue<C>, ContextValue<D>] :
    T extends [infer A, infer B, infer C, infer D, infer E] ? [ContextValue<A>, ContextValue<B>, ContextValue<C>, ContextValue<D>, ContextValue<E>] :
    T extends [infer A, infer B, infer C, infer D, infer E, infer F] ? [ContextValue<A>, ContextValue<B>, ContextValue<C>, ContextValue<D>, ContextValue<E>, ContextValue<F>] :
    T extends [infer A, infer B, infer C, infer D, infer E, infer F, infer G] ? [ContextValue<A>, ContextValue<B>, ContextValue<C>, ContextValue<D>, ContextValue<E>, ContextValue<F>, ContextValue<G>] :
    T extends [infer A, infer B, infer C, infer D, infer E, infer F, infer G, infer H] ? [ContextValue<A>, ContextValue<B>, ContextValue<C>, ContextValue<D>, ContextValue<E>, ContextValue<F>, ContextValue<G>, ContextValue<H>] :
    T extends [infer A, infer B, infer C, infer D, infer E, infer F, infer G, infer H, infer I] ? [ContextValue<A>, ContextValue<B>, ContextValue<C>, ContextValue<D>, ContextValue<E>, ContextValue<F>, ContextValue<G>, ContextValue<H>, ContextValue<I>] :
    T extends [infer A, infer B, infer C, infer D, infer E, infer F, infer G, infer H, infer I, infer J] ? [ContextValue<A>, ContextValue<B>, ContextValue<C>, ContextValue<D>, ContextValue<E>, ContextValue<F>, ContextValue<G>, ContextValue<H>, ContextValue<I>, ContextValue<J>] :
    any[];

function zip <A, B>(a: Array<A>, b: Array<B>): Array<[A,B]> {
    const result: Array<[A,B]> = [];
    const length = Math.min(a.length, b.length);
    for (let i = 0; i < length; ++i) result.push([ a[i], b[i] ]);
    return result;
}
