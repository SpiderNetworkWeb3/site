// cleaner.js

import { Connection, PublicKey } from "https://unpkg.com/@solana/web3.js@1.76.0/lib/index.iife.js";

const heliusEndpoint = "https://mainnet.helius-rpc.com/?api-key=4a24a1d6-8411-4b75-9524-24962846e3de";
const heliusAssetEndpoint = "https://api.helius.xyz/v0/addresses/";

let walletPublicKey = null;

// DOM Elements
const connectButton = document.getElementById("connectWallet");
const walletInfoDiv = document.getElementById("walletInfo");
const solBalanceSpan = document.getElementById("solBalance");
const tokenList = document.getElementById("tokenList");
const nftList = document.getElementById("nftList");
const serumList = document.getElementById("serumList");
const modal = document.getElementById("confirmationModal");
const cancelBtn = document.getElementById("cancelBtn");
const proceedBtn = document.getElementById("proceedBtn");

// Modal Behavior
document.addEventListener("DOMContentLoaded", () => {
  modal.classList.remove("hidden");

  cancelBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  proceedBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });
});

// Wallet Connect Logic
connectButton.addEventListener("click", async () => {
  try {
    if (!window.solana || !window.solana.isPhantom) {
      alert("Phantom Wallet not found. Please install or open in Phantom browser.");
      return;
    }

    const resp = await window.solana.connect();
    walletPublicKey = resp.publicKey.toString();
    console.log("Connected wallet:", walletPublicKey);
    walletInfoDiv.style.display = "block";
    fetchWalletInfo(walletPublicKey);
  } catch (err) {
    console.error("Wallet connection failed:", err);
    alert("Could not connect to wallet.");
  }
});

// Fetch Wallet Info
async function fetchWalletInfo(address) {
  try {
    const connection = new Connection(heliusEndpoint);

    // SOL Balance
    const solBalanceLamports = await connection.getBalance(new PublicKey(address));
    const solBalance = solBalanceLamports / 1e9;
    solBalanceSpan.textContent = solBalance.toFixed(3) + " SOL";

    // Token + NFT data
    const url = `${heliusAssetEndpoint}${address}/assets?displayOptions=compressed,unlisted&api-key=4a24a1d6-8411-4b75-9524-24962846e3de`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.items || !Array.isArray(data.items)) {
      throw new Error("Unexpected data format from Helius.");
    }

    const tokens = data.items.filter(item =>
      item.token_info && item.token_info.decimals > 0 && Number(item.token_info.balance) > 0
    );

    const nfts = data.items.filter(item =>
      item.interface === "V1_NFT" || (item.token_info?.decimals === 0 && item.content?.metadata?.name)
    );

    displayTokens(tokens);
    displayNFTs(nfts);
    displaySerumAccounts(); // Placeholder
  } catch (err) {
    console.error("Fetch error:", err);
    alert("Failed to fetch wallet data. Check console.");
  }
}

// Display Functions
function displayTokens(tokens) {
  tokenList.innerHTML = '';
  if (!tokens.length) {
    tokenList.innerHTML = '<p>No SPL tokens found.</p>';
    return;
  }

  tokens.forEach(token => {
    const div = document.createElement("div");
    div.className = "token-card";
    div.innerHTML = `
      <strong>${token.token_info.symbol || "Unknown"}</strong><br/>
      Balance: ${Number(token.token_info.balance).toFixed(4)}<br/>
      Mint: <code>${token.token_info.mint}</code><br/>
      <button onclick="alert('Burn function coming soon')">🔥 Burn</button>
    `;
    tokenList.appendChild(div);
  });
}

function displayNFTs(nfts) {
  nftList.innerHTML = '';
  if (!nfts.length) {
    nftList.innerHTML = '<p>No NFTs found.</p>';
    return;
  }

  nfts.forEach(nft => {
    const div = document.createElement("div");
    div.className = "token-card";
    div.innerHTML = `
      <img src="${nft.content?.links?.image || ''}" alt="NFT" width="100"/><br/>
      <strong>${nft.content.metadata.name}</strong><br/>
      Mint: <code>${nft.token_info.mint}</code>
    `;
    nftList.appendChild(div);
  });
}

function displaySerumAccounts() {
  serumList.innerHTML = '<p>Coming soon: Serum account cleanup.</p>';
}
