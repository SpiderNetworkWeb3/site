const heliusRpcUrl = "https://mainnet.helius-rpc.com/?api-key=4a24a1d6-8411-4b75-9524-24962846e3de";

let walletPublicKey = null;

// DOM refs
const connectButton = document.getElementById("connectWallet");
const walletInfoDiv = document.getElementById("walletInfo");
const solBalanceSpan = document.getElementById("solBalance");
const tokenList = document.getElementById("tokenList");
const nftList = document.getElementById("nftList");
const serumList = document.getElementById("serumList");
const modal = document.getElementById("modal");
const cancelBtn = document.getElementById("cancelBtn");
const proceedBtn = document.getElementById("proceedBtn");

// Modal logic
document.addEventListener("DOMContentLoaded", () => {
  modal.classList.remove("hidden");
  cancelBtn.addEventListener("click", () => window.location.href = "index.html");
  proceedBtn.addEventListener("click", () => modal.style.display = "none");
});

// Phantom deeplink or connect
connectButton.addEventListener("click", async () => {
  if (!window.solana || !window.solana.isPhantom) {
    window.open("https://phantom.app/ul/browse/" + encodeURIComponent(window.location.href), "_blank");
    return;
  }
  try {
    const resp = await window.solana.connect();
    walletPublicKey = resp.publicKey.toString();
    console.log("Connected:", walletPublicKey);
    walletInfoDiv.style.display = "block";
    fetchWalletInfo(walletPublicKey);
  } catch (err) {
    console.error("Connection failed", err);
    alert("Could not connect wallet.");
  }
});

// Fetch assets via JSON-RPC POST
async function fetchWalletInfo(address) {
  try {
    // SOL Balance
    const conn = new solanaWeb3.Connection(heliusRpcUrl);
    const lamports = await conn.getBalance(new solanaWeb3.PublicKey(address));
    solBalanceSpan.textContent = (lamports / 1e9).toFixed(3) + " SOL";

    // Helius JSON-RPC for assets
    const body = {
      jsonrpc: "2.0",
      id: "1",
      method: "getAssetsByOwner",
      params: { ownerAddress: address, page: 1, limit: 1000 }
    };
    const resp = await fetch(heliusRpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const { result } = await resp.json();

    const assets = result.items;
    const tokens = assets.filter(a => a.token_info?.decimals > 0);
    const nfts = assets.filter(a => a.token_info?.decimals === 0 && a.interface?.includes("NFT"));

    displayTokens(tokens);
    displayNFTs(nfts);
    serumList.innerHTML = '<p>Serum cleanup coming soon.</p>';
  } catch (e) {
    console.error("Fetch error", e);
    alert("Failed to fetch assets. Check console.");
  }
}

function displayTokens(tokens) {
  tokenList.innerHTML = '';
  if (!tokens.length) {
    tokenList.innerHTML = '<p>No SPL tokens found.</p>';
    return;
  }
  tokens.forEach(t => {
    const div = document.createElement("div");
    div.className = "token-card";
    div.innerHTML = `
      <strong>${t.token_info.symbol || "UNKNOWN"}</strong><br>
      Balance: ${Number(t.token_info.balance || 0).toFixed(4)}<br>
      Mint: <code>${t.token_info.mint}</code><br>
      <button onclick="alert('Burn token coming soon')">Burn Token</button>
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
    const name = nft.content?.metadata?.name || "Unnamed NFT";
    const img = nft.content?.links?.image || "";
    const mint = nft.token_info?.mint || nft.id;
    const div = document.createElement("div");
    div.className = "nft-card";
    div.innerHTML = `
      <img src="${img}" alt="NFT"/><br>
      <strong>${name}</strong><br/>
      Mint: <code>${mint}</code>
    `;
    nftList.appendChild(div);
  });
}
