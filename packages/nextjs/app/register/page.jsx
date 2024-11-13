/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import RealEstateFractionalize from "../../artifacts/contracts/RealEstateFractionalize.sol/RealEstateFractionalize.json";
import { liskAddress } from "../../config";
import "dotenv/config";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { getTargetNetworks } from "~~/utils/scaffold-eth";

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */

const allowedNetworks = getTargetNetworks();
// const liskAddress = liskAddress;

const Register = () => {
  const navigate = useRouter();
  const [errorMessage, setErrorMessage] = useState(null);
  const [imageView, setImageView] = useState();
  const [metaDataURL, setMetaDataURl] = useState();
  const [txURL, setTxURL] = useState();
  const [txStatus, setTxStatus] = useState();
  const [formInput, updateFormInput] = useState({ name: "" });

  if (allowedNetworks.filter(allowedNetwork => allowedNetwork.id) !== 59141) {
    // const liskAddress = liskAddress;
  } else {
    alert("Choose Linea Sepolia Testnet from your wallet and try again.");
  }

  async function createItem() {
    const { name } = formInput;
    if (!name) return;

    try {
      //const added = await client.add(data)

      const url = name;
      setMetaDataURL(url);
      console.log("url is ", url);
      console.log("metadataURL is ", url);
      /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
      sendTxToBlockchain(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  const sendTxToBlockchain = async metaDataURL => {
    try {
      setTxStatus("Adding transaction to Blockchain");

      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);

      const connectedContract = new ethers.Contract(liskAddress, RealEstateFractionalize.abi, provider.getSigner());
      console.log("Connected to contract", liskAddress);
      console.log("IPFS blockchain uri is ", metaDataURL);

      const Tx = await connectedContract.createFile(metaDataURL);
      console.log("File successfully created and added to Blockchain");
      await Tx.wait();

      // 2. preview the minted nft
      previewImage(metaDataURL);

      //3. navigate("/explore");
      console.log("Opening explore page");
      // navigate.push('/explore');
      //return Tx;
    } catch (error) {
      setErrorMessage("Failed to send tx to Blockchain.");
      console.log(error);
    }
  };

  const previewImage = metaDataURL => {
    console.log("getIPFSGatewayURL2 two is ...");

    fetch(metaDataURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        const imgViewString = data.image;
        console.log("image ipfs path is", imgViewString);
        setImageView(imgViewString);
        setTxURL(`Check transaction on Blockchain Explorer`);
        setTxStatus("File addition was successfully!");
        console.log("File preview completed");
        console.log(data);
      })
      .catch(function () {
        console.log("Error is Error");
      });
  };

  return (
    <div>
      <div className="bg-blue-100 text-4xl text-center text-black font-bold pt-10">
        <h1> Register a Property</h1>
      </div>
      <div className="flex justify-center bg-blue-100">
        <div className="w-1/2 flex flex-col pb-12 ">
          <input
            placeholder="Enter the json URL for the  property"
            className="mt-5 border rounded p-4 text-xl"
            onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
          />
          <br />

          <div className=" text-black text-xl">
            {txStatus && <p>{txStatus}</p>}

            {metaDataURL && (
              <p className="text-blue">
                <a href={metaDataURL} className="text-blue">
                  Metadata on IPFS
                </a>
              </p>
            )}

            {txURL && (
              <p>
                <a href={txURL} className="text-blue">
                  See the new transaction
                </a>
              </p>
            )}

            {errorMessage}

            {imageView && (
              // <iframe
              <img
                className="mb-10"
                title="File"
                src={imageView}
                alt="Image preview"
                frameBorder="0"
                height="100%"
                //width="100%"
              />
            )}
          </div>

          <button
            type="button"
            onClick={createItem}
            className="font-bold mt-20 bg-yellow-500 text-white text-2xl rounded p-4 shadow-lg"
          >
            Publish Property
          </button>
        </div>
      </div>
    </div>
  );
};
export default Register;
