import React, { useState, useEffect } from "react";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import KryptoBird from "../abis/KryptoBird.json";
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardImage,
  MDBCardText,
  MDBBtn,
} from "mdb-react-ui-kit";
import "./App.css";

export default function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [totalSupply, setTotalSupply] = useState(0);
  const [kryptoBirdz, setKryptoBirdz] = useState([]);
  const [bird, setBird] = useState("");

  useEffect(() => {
    const loadWeb3 = async () => {
      const provider = await detectEthereumProvider();
      if (provider) {
        console.log("ethereum wallet is connected");
        setWeb3(new Web3(provider));
      } else {
        console.log("no ethereum wallet detected");
      }
    };
    loadWeb3();
  }, []);

  useEffect(() => {
    if (web3) {
      const loadBlockchainData = async () => {
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        const networkId = await web3.eth.net.getId();
        const networkData = KryptoBird.networks[networkId];
        if (networkData) {
          const abi = KryptoBird.abi;
          const address = networkData.address;

          setContract(new web3.eth.Contract(abi, address));
        } else {
          window.alert("Smart contract not deployed");
        }
      };
      loadBlockchainData();
    }
  }, [web3]);

  useEffect(() => {
    if (contract) {
      const loadKryptoBirdzData = async () => {
        setTotalSupply(await contract.methods.totalSupply().call());
      };
      const loadTotalSupply = async () => {
        const birdz = [];
        for (let i = 1; i <= totalSupply; i++) {
          const bird = await contract.methods.KryptoBirdz(i - 1).call();
          birdz.push(bird);
        }
        setKryptoBirdz(birdz);
      };
      loadKryptoBirdzData();
      loadTotalSupply();
    }
  }, [contract, totalSupply]);

  const mint = (bird) => {
    contract.methods
      .mint(bird)
      .send({ from: account })
      .once("receipt", (receipt) => {
        setKryptoBirdz([...kryptoBirdz, bird]);
      });
  };

  const handleBird = (event) => {
    setBird(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    mint(bird);
  };

  return (
    <div className="container-filled">
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <div
          className="navbar=brand col-sm-3 col-md-3 mr-0"
          style={{ color: "white" }}
        >
          Krypto Birdz NFTs (Non Fungible Tokens)
        </div>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-white">{account}</small>
          </li>
        </ul>
      </nav>
      <div className="container-fluid mt-1">
        <div className="row">
          <main role="main" className="col-lg-12 d-flex text-center">
            <div className="content mr-auto ml-auto" style={{ opacity: "0.8" }}>
              <h1 style={{ color: "black" }}>KryptoBirdz - NFT Marketplace</h1>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="add a file location"
                  className="mb-1"
                  onChange={handleBird}
                />
                <input
                  type="submit"
                  className="btn btn-primary btn-black"
                  value="MINT"
                  style={{ margin: "6px" }}
                />
              </form>
            </div>
          </main>
        </div>
        <hr></hr>
        <div className="row textCenter">
          {kryptoBirdz.map((kryptoBird, key) => {
            return (
              <div key={key}>
                <div>
                  <MDBCard className="token img" style={{ maxWidth: "22rem" }}>
                    <MDBCardImage
                      src={kryptoBird}
                      position="top"
                      height="250rem"
                      style={{ marginRight: "4px" }}
                    />
                    <MDBCardBody>
                      <MDBCardTitle> KryptoBirdz </MDBCardTitle>
                      <MDBCardText>
                        The KryptoBirdz are 20 uniquely generated KBirdz from
                        the cyberpunk cloud galaxy Mystopia!
                      </MDBCardText>
                      <MDBBtn hfre={kryptoBird}>Download</MDBBtn>
                    </MDBCardBody>
                  </MDBCard>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
