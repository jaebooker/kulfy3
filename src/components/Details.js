import React, { Component } from "react";
import Web3 from "web3";
import "./App.css";
import KulfyV3 from "../abis/KulfyV3.json";
import Navbar from "./Navbar";
import Kulfys from "./Kulfys";
import axios from "axios";

class Details extends Component {


  async componentDidMount() {

    await this.loadWeb3();
    await this.loadBlockchainData();

  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying ethereum based brower"
      );
    }
  }

  async tipKulfy(id) {
    console.log("tip item kulfy ", id, this.state.account);
    this.tipKulfyOwner(id, "10");
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    //Network ID
    const networkId = await web3.eth.net.getId();
    const networkData = KulfyV3.networks[networkId];
    if (networkData) {
      const kulfyV3 = new web3.eth.Contract(KulfyV3.abi, networkData.address);
      console.log(`kulfyV3`, kulfyV3);
      this.setState({ kulfyV3 });
      const kulfiesCount = await kulfyV3.methods.tokenIds().call();
      //const kulfiesCount = 0
      console.log(`kulfiesCount`, kulfiesCount);
      this.setState({ kulfiesCount });

      // Load Images
      for (let i = 1; i <= kulfiesCount; i++) {
        //get tokenURI from contract
        const ipfs_metadata = await kulfyV3.methods.tokenURI(i).call();
        console.log("ipfs_metadata ", ipfs_metadata);

        //get owner of
        const owner_address = await kulfyV3.methods.ownerOf(i).call();
        console.log("ipfs_metadata ", ipfs_metadata, i, owner_address);

        const kulfy = await kulfyV3.methods.kulfies(i).call();
        this.setState({
          kulfies: [...this.state.kulfies, kulfy],
        });
      }

     
    let id = "";
    let search = window.location.search;
    let params = new URLSearchParams(search);
    id = params.get("id");

    this.state.id = id;


    this.setState({asset_url:this.state.kulfies[id-1].assetURI});
    this.setState({kid:this.state.kulfies[id-1].kid});

    const getKulfyAPI =
      "https://gateway.kulfyapp.com/V3/gifs/getKulfy?client=web&id=" +
      this.state.kid +
      "&language=all,telugu,tamil,hindi,malayalam,english";

    axios.defaults.headers.common = {
      "Content-Type": "application/json",
    };

    const postCommentsResponse = await axios.get(`${getKulfyAPI}`);
    console.log(
      `postComments Response from convo: ${JSON.stringify(
        postCommentsResponse
      )}`
    );

    const response = postCommentsResponse;
    this.state.kulfy = response.data.kulfy_info;
    const getMetaDataResponse = await axios.get(`${this.state.kulfies[id-1].tokenURI}`);

    this.setState({chain:getMetaDataResponse.data.source.chain});
    this.setState({chain:getMetaDataResponse.data.source.chain});
    this.setState({description:getMetaDataResponse.data.source.description});
    this.setState({original_url:getMetaDataResponse.data.source.cached_file_url});
    this.setState({ loading: false });
    } else {
      window.alert("Kulfy contarct not deployed to any network");
    }
  }


  async tipKulfyOwner(id, tipAmount) {
    this.setState({ loading: true });
    this.state.kulfyV3.methods
      .tipKulfyOwner(id)
      .send({
        from: this.state.account,
        value: window.web3.utils.toWei("1", "Ether"),
      })
      .on("transactionHash", (hash) => {
        console.log("tans hash ", hash);
        this.setState({ loading: false });
      });
  }

  constructor(props) {
    super(props);
    this.state = {
      account: "",
      kulfyV3: "",
      kulfies: [],
      loading: true,
      kulfy: "",
    };
  }

  render() {
    return (
      <>
        <Navbar />
        <section class="container">
        <div class="row">
            <div class="col-md-6 ">
                <img class="w-100 br-18" src="./assets/images/sample-image.png" alt="" />
                <div>
                    <img src="./assets/images/sample-user.svg" alt="" />
                     <video
                        autoPlay
                        loop
                        muted
                        width="480"
                        height="480"
                        controls
                        src={this.state.asset_url}
                      >
                        Your browser does not support the video tag.
                      </video>
                    <span>Chai Biscuit</span>
                </div>
            </div>
            <div class="col-md-6 d-flex flex-column nft-details">
                <h1>{this.state.kulfy.name}</h1>
                <div class="info my-2">
                    <a href="#">
                        <img src="./assets/images/gifs_white.svg" alt="" />
                        <span>{this.state.kulfy.content_type}</span>
                    </a>
                    <a href="#"><span>480x480</span></a>
                </div>
                <button class="btn-radium my-3">Tip</button>
                <hr />
                {this.state.description}
                <div class="nft-actions my-2">
                    <a href={this.state.original_url} target="blank">View Original</a>
                </div>
                
            </div>
        </div>
    </section>
     <Kulfys />
      </>
    );
  }
}

export default Details;
