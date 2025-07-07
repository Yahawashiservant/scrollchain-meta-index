import App from './App.jsx';
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
import { WagmiConfig, createConfig } from 'wagmi';
import { arbitrumSepolia } from 'wagmi/chains';
import { walletConnect } from '@wagmi/connectors';
import { AccountKitProvider } from '@account-kit/react';

const config = createConfig({
  chains: [arbitrumSepolia],
  connectors: [
    walletConnect({ projectId: 'VHi5TN0r3pCc7FkHD6ljDyzi7yZDLBE9' })
  ]
});

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <WagmiConfig config={config}>
    <AccountKitProvider
      apiKey="VHi5TN0r3pCc7FkHD6ljDyzi7yZDLBE9"
      gasPolicyId="6ecc9265-7b21-4f53-a922-745c6cf42efb"
    >
      <App />
    </AccountKitProvider>
  </WagmiConfig>
);