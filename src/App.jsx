import { useAccountKit } from '@account-kit/react';
import './App.css';

export default function App() {
  const { connect, disconnect, address, isConnected } = useAccountKit();

  return (
    <main>
      <h1>ScrollPlanet Smart Wallet</h1>
      {isConnected ? (
        <>
          <p>Connected: {address}</p>
          <button onClick={disconnect}>Disconnect</button>
        </>
      ) : (
        <button onClick={connect}>Connect Wallet</button>
      )}
    </main>
  );
}