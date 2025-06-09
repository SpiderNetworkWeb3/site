import { Connection, PublicKey } from "https://unpkg.com/@solana/web3.js@1.76.0/lib/index.iife.js";

const heliusRpcUrl = "https://mainnet.helius-rpc.com/?api-key=4a24a1d6-8411-4b75-9524-24962846e3de";

let walletPublicKey = null;

// DOM elements
const connectButton = document.getElementById("connectWallet");
const walletInfoDiv = document.getElementById("walletInfo");
const solBalanceSpan = document.getElementById("solBalance");
const tokenList = document.getElementById("tokenList");
const nftList = document.getElementById("nftList");
const serumList = document.getElementById("serumList");

const modal = document.getElementById("confirmationModal");
const cancelBtn = document.getElementById("cancelBtn");
const proceedBtn = document.getElementById("proceedBtn");

// Modal logic
document.addEventListener("DOMContentLoaded", () => {
  modal.classList.remove("hidden");

  cancelBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  proceedBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });
});

// Phantom wallet connect
connectButton.addEventListener("click", async () => {
  try {
    if (!window.solana || !window.solana.isPhantom) {
      alert("Phantom Wallet not found. Please open this page in the Phantom browser.");
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

// Fetch balance and assets using POST method
async function fetchWalletInfo(address) {
  try {
    const connection = new Connection(heliusRpcUrl);
    const solBalanceLamports = await connection.getBalance(new PublicKey(address));
    const solBalance = solBalanceLamports / 1e9;
    solBalanceSpan.textContent = solBalance.toFixed(5) + " SOL";

    const response = await fetch(heliusRpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "1",
        method: "getAssetsByOwner",
        params: {
          ownerAddress: address,
          page: 1,
          limit: 100,
          sortBy: { sortBy: "created", sortDirection: "asc" },
          options: {
            showUnverifiedCollections: true,
            showCollectionMetadata: true,
            showGrandTotal: false,
            showFungible: true,
            showNativeBalance: false,
            showInscription: false,
            showZeroBalance: false
          }
        }
      })
    });

    const data = await response.json();
    const items = data.result?.items;

    if (!items || !Array.isArray(items)) {
      throw new Error("Unexpected response format from Helius.");
    }

    const tokens = items.filter(item => item.token_info?.decimals > 0);
    const nfts = items.filter(item => item.interface === "V1_NFT");

    displayTokens(tokens);
    displayNFTs(nfts);
    displaySerumAccounts(); // placeholder
  } catch (err) {
    console.error("Fetch error:", err);
    alert("Failed to fetch wallet data. Check console.");
  }
}

// Render tokens
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

// Render NFTs
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
      <strong>${nft.content?.metadata?.name || "Unknown NFT"}</strong><br/>
      Mint: <code>${nft.id}</code>
    `;
    nftList.appendChild(div);
  });
}

// Serum placeholder
function displaySerumAccounts() {
  serumList.innerHTML = '<p>Coming soon: Serum account cleanup.</p>';
}
