import {
  Connection,
  PublicKey
} from "@solana/web3.js";

const heliusEndpoint = "https://mainnet.helius-rpc.com/?api-key=4a24a1d6-8411-4b75-9524-24962846e3de";
const heliusAssetEndpoint = "https://api.helius.xyz/v0/addresses";

let walletPublicKey = null;

// DOM Elements
const connectButton = document.getElementById("connectWallet");
const walletInfoDiv = document.getElementById("walletInfo");
const solBalanceSpan = document.getElementById("solBalance");
const tokenList = document.getElementById("tokenList");
const nftList = document.getElementById("nftList");

// Modal logic
const modal = document.getElementById('modal');
const cancelBtn = document.getElementById('cancelBtn');
const proceedBtn = document.getElementById('proceedBtn');

// Modal functionality
document.addEventListener('DOMContentLoaded', () => {
  modal.classList.remove('hidden');

  cancelBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
  });

  proceedBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
  });
});

// Phantom detection and connection
const isPhantomAvailable = () => {
  return window.solana && window.solana.isPhantom;
};

connectButton.addEventListener("click", async () => {
  if (!isPhantomAvailable()) {
    const url = "https://phantom.app/ul/browse/" + encodeURIComponent(window.location.href);
    window.open(url, "_blank");
    return;
  }

  try {
    const resp = await window.solana.connect();
    walletPublicKey = resp.publicKey.toString();
    walletInfoDiv.style.display = "block";
    fetchWalletInfo(walletPublicKey);
  } catch (err) {
    console.error("Wallet connection failed:", err);
    alert("Failed to connect to wallet.");
  }
});

// Fetch wallet info
async function fetchWalletInfo(address) {
  try {
    const connection = new Connection(heliusEndpoint);
    const solBalanceLamports = await connection.getBalance(new PublicKey(address));
    const solBalance = solBalanceLamports / 1e9;
    solBalanceSpan.textContent = solBalance.toFixed(3) + " SOL";

    const response = await fetch(`${heliusAssetEndpoint}/${address}/assets?api-key=4a24a1d6-8411-4b75-9524-24962846e3de`);
    if (!response.ok) throw new Error("Helius API response not OK");
    const { items } = await response.json();

    const tokens = items.filter(i => i.token_info?.decimals > 0);
    const nfts = items.filter(i => i.token_info?.decimals === 0 || i.interface === "V1_NFT");

    displayTokens(tokens);
    displayNFTs(nfts);
  } catch (error) {
    console.error("Error fetching wallet info:", error);
    alert("Could not fetch wallet data.");
  }
}

// Display tokens
function displayTokens(tokens) {
  tokenList.innerHTML = "";
  if (!tokens.length) {
    tokenList.innerHTML = "<p>No SPL tokens found.</p>";
    return;
  }

  tokens.forEach(token => {
    const div = document.createElement("div");
    div.className = "token-card";
    div.innerHTML = `
      <strong>${token.token_info?.symbol || "Unknown"}</strong><br/>
      Balance: ${Number(token.token_info?.balance || 0).toFixed(4)}<br/>
      Mint: <code>${token.token_info?.mint}</code><br/>
      <button onclick="alert('Burn function coming soon')">Burn Token</button>
    `;
    tokenList.appendChild(div);
  });
}

// Display NFTs
function displayNFTs(nfts) {
  nftList.innerHTML = "";
  if (!nfts.length) {
    nftList.innerHTML = "<p>No NFTs found.</p>";
    return;
  }

  nfts.forEach(nft => {
    const div = document.createElement("div");
    div.className = "nft-card";
    div.innerHTML = `
      <img src="${nft.content?.links?.image || ''}" alt="NFT"/><br/>
      <strong>${nft.content?.metadata?.name || "Unnamed NFT"}</strong><br/>
      Mint: <code>${nft.token_info?.mint || nft.id}</code>
    `;
    nftList.appendChild(div);
  });
}
