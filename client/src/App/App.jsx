import { hot } from 'react-hot-loader/root';
import React from 'react';
import { Application } from './styles';
import Main from './components/Main';

const App = () => (
    <>
        <Application >
            <Main />
        </Application>
    </>
);

export default hot(App);