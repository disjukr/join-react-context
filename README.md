# join-react-context
join multiple react context into one.
support typescript.

## usage
```tsx
import * as React from 'react';
import {
    joinContext,
    // joinProvider,
    // joinConsumer,
} from 'join-react-context';

const contextA = React.createContext( ... );
const contextB = React.createContext( ... );

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
```
