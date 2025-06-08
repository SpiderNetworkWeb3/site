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
const modal = document.getElementById("modal");
const cancelBtn = document.getElementById("cancelBtn");
const proceedBtn = document.getElementById("proceedBtn");

// Modal control
document.addEventListener("DOMContentLoaded", () => {
  modal.classList.remove("hidden");

  cancelBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  proceedBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });
});

// Check if Phantom is installed (and handle mobile deep linking)
function isPhantomInstalled() {
  return window.solana && window.solana.isPhantom;
}

// Handle wallet connection
connectButton.addEventListener("click", async () => {
  if (!isPhantomInstalled()) {
    const deepLink = "https://phantom.app/ul/browse/" + encodeURIComponent(window.location.href);
    window.open(deepLink, "_blank");
    return;
  }

  try {
    const resp = await window.solana.connect();
    walletPublicKey = resp.publicKey.toString();
    console.log("Connected wallet:", walletPublicKey);
    walletInfoDiv.style.display = "block";
    fetchWalletInfo(walletPublicKey);
  } catch (err) {
    console.error("Wallet connection failed:", err);
  }
});

// Fetch wallet info
async function fetchWalletInfo(address) {
  try {
    const connection = new solanaWeb3.Connection(heliusEndpoint);
    const solBalanceLamports = await connection.getBalance(new solanaWeb3.PublicKey(address));
    const solBalance = solBalanceLamports / 1e9;
    solBalanceSpan.textContent = solBalance.toFixed(3) + " SOL";

    const response = await fetch(`${heliusAssetEndpoint}${address}/assets?api-key=4a24a1d6-8411-4b75-9524-24962846e3de`);
    const data = await response.json();

    const tokens = data.items.filter(item => item.token_info && item.token_info.decimals > 0);
    const nfts = data.items.filter(item => item.content?.metadata?.name && item.token_info?.decimals === 0);

    displayTokens(tokens);
    displayNFTs(nfts);
    displaySerumAccounts(); // placeholder
  } catch (error) {
    console.error("Error fetching wallet info:", error);
    alert("Failed to fetch wallet data. See console for details.");
  }
}

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
      <button onclick="alert('Burn function coming soon')">Burn Token</button>
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
    div.className = "nft-card";
    div.innerHTML = `
      <img src="${nft.content?.links?.image || ''}" alt="NFT" /><br/>
      <strong>${nft.content.metadata.name}</strong><br/>
      Mint: <code>${nft.token_info.mint}</code>
    `;
    nftList.appendChild(div);
  });
}

function displaySerumAccounts() {
  serumList.innerHTML = '<p>Coming soon: Serum account cleanup.</p>';
}
