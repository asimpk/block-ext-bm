import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { MemoryRouter } from "react-router-dom";
import { Web3Provider } from './contexts/Web3Context/Web3Provider';
import './polyfills';
import { StateProvider } from './contexts/StateConrext/StateProvider';



const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <MemoryRouter>
      <Web3Provider>
        <StateProvider>
          <App />
        </StateProvider>
      </Web3Provider>
    </MemoryRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
