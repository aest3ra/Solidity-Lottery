import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import lotteryABI from './lotteryABI.json';

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [betNum1, setBetNum1] = useState('');
  const [betNum2, setBetNum2] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const contractAddress = 'http://127.0.0.1:8545';

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        if (window.ethereum) {
          const web3 = new Web3(window.ethereum);
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          setWeb3(web3);

          const accounts = await web3.eth.getAccounts();
          if (accounts.length === 0) {
            throw new Error('No accounts found. Make sure MetaMask is connected.');
          }
          setAccounts(accounts);

          const contractInstance = new web3.eth.Contract(lotteryABI.abi);
          setContract(contractInstance);
        } else {
          alert('MetaMask is not detected. Please install MetaMask.');
          setError('MetaMask not detected');
        }
      } catch (error) {
        console.error("Error initializing web3 or loading contract/accounts:", error);
        setError('Failed to load web3, accounts, or contract. Check console for details.');
      }
    };

    initWeb3();
  }, []);

  const placeBet = async () => {
    if (!contract || accounts.length === 0) {
      setError("Contract not loaded or accounts not found");
      return;
    }

    try {
      const betNumbers = [parseInt(betNum1), parseInt(betNum2)];
      const betAmount = web3.utils.toWei('0.005', 'ether');

      const response = await contract.methods.bet(betNumbers).send({ from: accounts[0], value: betAmount });
      console.log(response);

      const events = response.events;
      if (events.WIN) {
        setResult('Win');
      } else if (events.DRAW) {
        setResult('Draw');
      } else if (events.FAIL) {
        setResult('Fail');
      }
    } catch (error) {
      console.error("Error placing bet:", error);
      setError("Bet transaction failed");
    }
  };

  return (
    <div className="App">
      <h1>Lottery Betting DApp</h1>
      <input
        type="number"
        value={betNum1}
        onChange={(e) => setBetNum1(e.target.value)}
        placeholder="Enter first number"
      />
      <input
        type="number"
        value={betNum2}
        onChange={(e) => setBetNum2(e.target.value)}
        placeholder="Enter second number"
      />
      <button onClick={placeBet}>Place Bet</button>

      {result && <h2>Result: {result}</h2>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default App;
