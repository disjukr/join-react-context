# join-react-context
join multiple react context into one.

works perfectly with typescript.

## usage
```tsx
import * as React from 'react';
import {
    Providers,
    joinContext,
    joinProvider,
    joinConsumer,
} from 'join-react-context';

const contextA = React.createContext('context a');
const contextB = React.createContext('context b');

{ // providers array style
    <Providers providers={[
        <contextA.Provider value='a'/>,
        <contextB.Provider value='b'/>,
    ]}>
        {children}
    </Providers>
    // is same as...
    <contextA.Provider value='a'>
        <contextB.Provider value='b'>
            {children}
        </contextB.Provider>
    </contextA.Provider>
}
{ // providers fragment style
    <Providers providers={<>
        <contextA.Provider value='a'/>
        <contextB.Provider value='b'/>
    </>}>
        {children}
    </Providers>
}
{ // join tuple style
    type Contexts = [ typeof contextA, typeof contextB ];
    const { Provider, Consumer } = joinContext<Contexts>([ contextA, contextB ]);

    const App = () => (
        <Provider value={[ 'a', 'b' ]}>
            <Component/>
        </Provider>
    );

    const Component = () => (
        <Consumer>
            { ([ a, b ]) => <div>{ a }, { b }</div> }
        </Consumer>
    );
}
{ // join object style
    const { Provider, Consumer } = joinContext({ a: contextA, b: contextB });

    const App = () => (
        <Provider value={{ a: 'a', b: 'b' }}>
            <Component/>
        </Provider>
    );

    const Component = () => (
        <Consumer>
            { ({ a, b }) => <div>{ a }, { b }</div> }
        </Consumer>
    );
}
{ // join mixed style (vice versa)
    type Contexts = [ typeof contextA, typeof contextB ];
    const Provider = joinProvider<Contexts>([ contextA, contextB ]);
    const Consumer = joinConsumer({ a: contextA, b: contextB });

    const App = () => (
        <Provider value={[ 'a', 'b' ]}>
            <Component/>
        </Provider>
    );

    const Component = () => (
        <Consumer>
            { ({ a, b }) => <div>{ a }, { b }</div> }
        </Consumer>
    );
}
```
