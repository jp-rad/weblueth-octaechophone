import React from 'react';
import { OctaEchoPhoneContextProvider } from '../../src';
import OctaEchoPhoneDevice from './components/OctaEchoPhoneDevice';
import Logo from './Logo';  // logo.svg ==> Logo.tsx
//import './App.css'; // ==> ../index.html

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Logo className="App-logo" />
        <p>
          Edit <code>src/app/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <p>
          <OctaEchoPhoneContextProvider connectionName='Octa Echo Phone' bluetooth={window.navigator.bluetooth}>
            <OctaEchoPhoneDevice />
          </OctaEchoPhoneContextProvider>
        </p>
      </header>
    </div>
  );
}

export default App;
