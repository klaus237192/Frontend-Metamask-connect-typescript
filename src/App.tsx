
import { useState ,useEffect, SetStateAction} from 'react';
import detectEthereumProvider from "@metamask/detect-provider";
import Web3Modal from "web3modal";
import Web3 from 'web3';
import './utils/App.css';
import { formatBalance, formatChainAsNum } from './utils';
import SpaceCreditABI from "./utils/SpaceCredit.json";
import ButtonAppBar from "./components/Appbar";
import { any } from 'hardhat/internal/core/params/argumentTypes';
import React from 'react';
function App() {
  const [hasProvider, setHasProvider] = useState(null);
  const initialState = { accounts: [],balance:"",chainId:"" }
  const [wallet, setWallet] = useState(initialState);
  const [isConnecting, setIsConnecting] = useState(false)  
  const [error, setError] = useState(false)                
  const [errorMessage, setErrorMessage] = useState("")   
  const [tokenBalance, setTokenBalance] = useState("");
  const [account, setAccount] = useState('');
  const providerOptions = {};
  const web3Modal = new Web3Modal({
     providerOptions // required
  });
  useEffect(() => {
    const refreshAccounts = (accounts: string | any[]) => {
      if (accounts.length > 0) {
        updateWallet(accounts);
      } else {
        setWallet(initialState);
      }
    }
    const refreshChain = (chainId: any) => {
      setWallet((wallet)=>({...wallet,chainId}))
    }
    const getProvider = async () =>  {
      const provider:any = await detectEthereumProvider({ silent: true });
      console.log(provider);
      setHasProvider(provider);
      if (provider) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        console.log(typeof (accounts));
        console.log(accounts);
        refreshAccounts(accounts)
        console.log(wallet.accounts[0]);
        window.ethereum.on('accountsChanged',refreshAccounts)
        window.ethereum.on('chainChanged', refreshChain);
      }
    }
    getProvider();
    return () => {
      window.ethereum?.removeListener('accountsChanged',refreshAccounts)
      window.ethereum?.removeListener("chainChanged", refreshChain)  
    }
  }, [])
  const getBalance = async () => {
    const Ethel = new Web3("https://eth-sepolia.g.alchemy.com/v2/mAROgYqxEpY1dWbR4J_2oUS2Imy4UK_L");
    const AccountAddress = "0x91F3A19A806A1484FcC7DB4278aD0CC4CA850084";
    const TokenAddress = "0x56671599c76C1305882483DF706a5f3F9CD749d3";
    const contract = new Ethel.eth.Contract(SpaceCreditABI, TokenAddress);
    
    let result:any = await contract.methods.totalSupply().call();
    const formattedResult = Ethel.utils.fromWei(result, "ether"); // 29803630.997051883414242659

    setTokenBalance(formattedResult);
    console.log(tokenBalance);
  }
  const updateWallet = async (accounts: string | any[]) => {
    const balance = formatBalance(await window.ethereum.request({   
      method: "eth_getBalance",                                  
      params: [accounts[0], "latest"],                       
    }))                                                     
    const chainId = await window.ethereum.request({          
      method: "eth_chainId",                                    
    })        
    setAccount(accounts[0]);
    console.log(accounts[0]);
    setWallet({ accounts:[], balance, chainId }) 
  }
  const handleConnect = async () => {
    getBalance();
    await window.ethereum.request({ method: "eth_requestAccounts", })
      .then((accounts: string | any[]) => {
        setError(false)
        updateWallet(accounts)
      })
      .catch((err: { message: SetStateAction<string>; }) => {
        setError(true)
        setErrorMessage(err.message)
      })
    setIsConnecting(!isConnecting);
  }
    return (
      <div className="App">
        {hasProvider &&
          <>
          <ButtonAppBar handleConnect={handleConnect} isConnecting={isConnecting} />
          <br></br>
          <br></br>
          <br></br>
          </>
        }
        { isConnecting?
          <>
            <div>wallet Accounts:{account}</div>
            <div>Token Balance:{tokenBalance}</div>
            <div>HEX ChainID:{wallet.chainId}</div>
            <div>Numeric ChinID:{formatChainAsNum(wallet.chainId)}</div>
          </>:<h2>Please display your total supply of token</h2>
        }
        {error && (
          <div onClick={() => setError(false)}>
            <strong>Error:</strong>{errorMessage}
          </div>
        )}
      </div>
  );
}

export default App;
