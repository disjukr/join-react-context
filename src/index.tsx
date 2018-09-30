import * as React from 'react';

export type TupleStyleContexts = React.Context<any>[];
export interface ObjectStyleContexts {
    [key: string]: React.Context<any>;
}
export type Contexts = TupleStyleContexts | ObjectStyleContexts;

export function joinContext<T extends Contexts>(contexts: T): React.Context<ContextValues<T>> {
    return {
        Provider: joinProvider(contexts),
        Consumer: joinConsumer(contexts),
    };
}

export function joinProvider<T extends Contexts>(contexts: T): React.Provider<ContextValues<T>> {
    return ({ value, children }) => {
        const items =
            Array.isArray(contexts) ?
            ziparr<React.Context<any>, any>(contexts, value as any) :
            zipobj<React.Context<any>, any>(contexts as any, value);
        return items.reduce<React.ReactElement<any> | null>((prev, curr) => {
            const [ context, value ] = curr;
            const { Provider } = context;
            return <Provider value={value}>{ prev || children }</Provider>;
        }, null);
    };
}

export function joinConsumer<T extends Contexts>(contexts: T): React.Consumer<ContextValues<T>> {
    type Child = (values: any) => React.ReactNode;
    if (Array.isArray(contexts)) {
        return ({ children }) => {
            return (contexts as TupleStyleContexts).reduce<Child>((prev, curr) => {
                const { Consumer } = curr;
                return (values: any) => <Consumer>{ value => (prev || children)([value, ...values]) }</Consumer>;
            }, null as any)([]) as any;
        };
    } else {
        return ({ children }) => {
            return Object.entries<React.Context<any>>(contexts).reduce<Child>((prev, curr) => {
                const [key, { Consumer }] = curr;
                return (values: any) => <Consumer>{ value => (prev || children)({ ...values, [key]: value }) }</Consumer>;
            }, null as any)({}) as any;
        };
    }
}

export type ContextValue<TContext> =
    TContext extends React.Context<infer V> ? V :
    TContext extends React.Provider<infer V> ? V :
    TContext extends React.Consumer<infer V> ? V :
    any;

export type ContextValues<TContext> =
    TContext extends {[key: string]: any} ? {[K in keyof TContext]: ContextValue<TContext[K]>} :
    TContext extends [infer A] ? [ContextValue<A>] :
    TContext extends [infer A, infer B] ? [ContextValue<A>, ContextValue<B>] :
    TContext extends [infer A, infer B, infer C] ? [ContextValue<A>, ContextValue<B>, ContextValue<C>] :
    TContext extends [infer A, infer B, infer C, infer D] ? [ContextValue<A>, ContextValue<B>, ContextValue<C>, ContextValue<D>] :
    TContext extends [infer A, infer B, infer C, infer D, infer E] ? [ContextValue<A>, ContextValue<B>, ContextValue<C>, ContextValue<D>, ContextValue<E>] :
    TContext extends [infer A, infer B, infer C, infer D, infer E, infer F] ? [ContextValue<A>, ContextValue<B>, ContextValue<C>, ContextValue<D>, ContextValue<E>, ContextValue<F>] :
    TContext extends [infer A, infer B, infer C, infer D, infer E, infer F, infer G] ? [ContextValue<A>, ContextValue<B>, ContextValue<C>, ContextValue<D>, ContextValue<E>, ContextValue<F>, ContextValue<G>] :
    TContext extends [infer A, infer B, infer C, infer D, infer E, infer F, infer G, infer H] ? [ContextValue<A>, ContextValue<B>, ContextValue<C>, ContextValue<D>, ContextValue<E>, ContextValue<F>, ContextValue<G>, ContextValue<H>] :
    TContext extends [infer A, infer B, infer C, infer D, infer E, infer F, infer G, infer H, infer I] ? [ContextValue<A>, ContextValue<B>, ContextValue<C>, ContextValue<D>, ContextValue<E>, ContextValue<F>, ContextValue<G>, ContextValue<H>, ContextValue<I>] :
    TContext extends [infer A, infer B, infer C, infer D, infer E, infer F, infer G, infer H, infer I, infer J] ? [ContextValue<A>, ContextValue<B>, ContextValue<C>, ContextValue<D>, ContextValue<E>, ContextValue<F>, ContextValue<G>, ContextValue<H>, ContextValue<I>, ContextValue<J>] :
    any[];

function ziparr<A, B>(a: Array<A>, b: Array<B>): Array<[A,B]> {
    const result: Array<[A,B]> = [];
    const length = Math.min(a.length, b.length);
    for (let i = 0; i < length; ++i) result.push([ a[i], b[i] ]);
    return result;
}

function zipobj<A, B>(a: {[key: string]: A}, b: {[key: string]: B}): Array<[A,B]> {
    const result: Array<[A,B]> = [];
    for (const key of Object.keys(a)) result.push([ a[key], b[key] ]);
    return result;
}
