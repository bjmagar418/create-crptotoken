// import React,{useState} from "react";
// import { Principal } from "@dfinity/principal";
// import {token} from "../../../declarations/token";

// function Transfer() {
  
//   const [recipientId,setId] =useState("");
//    const [amount,setAmount] =useState("");

//   async function handleClick() {
//     const recipient = Principal.fromText(recipientId);
//     const amountToTransfer = Number(amount);
//     await token.transfer(recipientId,amountToTransfer); 
//   }

//   return (
//     <div className="window white">
//       <div className="transfer">
//         <fieldset>
//           <legend>To Account:</legend>
//           <ul>
//             <li>
//               <input
//                 type="text"
//                 id="transfer-to-id"
//                 value={recipientId}
//                 onChange={(e) => setId(e.target.value)}
//               />
//             </li>
//           </ul>
//         </fieldset>
//         <fieldset>
//           <legend>Amount:</legend>
//           <ul>
//             <li>
//               <input
//                 type="number"
//                 id="amount"
//                 value={amount}
//                 onChange={(e) => setAmount(e.target.value)}
//               />
//             </li>
//           </ul>
//         </fieldset>
//         <p className="trade-buttons">
//           <button id="btn-transfer" onClick={handleClick} >
//             Transfer
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default Transfer;

import React, { useState } from "react";
import { Principal } from "@dfinity/principal";
import { token } from "../../../declarations/token";

function Transfer() {
  const [recipientInput, setRecipientInput] = useState("");
  const [amountInput, setAmountInput] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  async function handleTransfer() {
    try {
      setFeedbackMessage("");
      const trimmedRecipient = recipientInput.trim();
      const trimmedAmount = amountInput.trim();

      // 1. Validate inputs
      if (!trimmedRecipient) {
        alert("Please enter a valid recipient Principal ID.");
        return;
      }

      if (!trimmedAmount || Number(trimmedAmount) <= 0) {
        alert("Please enter a valid transfer amount.");
        return;
      }

      setIsDisabled(true);

      // 2. Safely parse the Principal object
      const recipientPrincipal = Principal.fromText(trimmedRecipient);
      const amount = Number(trimmedAmount);

      // 3. Call your canister's transfer method 
      // (Make sure your backend canister has a transfer function, e.g., transfer(to, amount))
      const result = await token.transfer(recipientPrincipal, amount);

      setFeedbackMessage(`Successfully transferred ${amount} tokens!`);
      console.log("Transfer result:", result);

    } catch (error) {
      console.error("Transfer failed:", error);
      alert("Transfer failed. Please check the Principal ID and amount, then try again.");
    } finally {
      setIsDisabled(false);
    }
  }

  return (
    <div className="window white">
      <label>Transfer Tokens:</label>
      <p>
        <input
          type="text"
          placeholder="Recipient Principal ID"
          value={recipientInput}
          onChange={(e) => setRecipientInput(e.target.value)}
        />
      </p>
      <p>
        <input
          type="number"
          placeholder="Amount to transfer"
          value={amountInput}
          onChange={(e) => setAmountInput(e.target.value)}
        />
      </p>
      <p className="trade-buttons">
        <button
          onClick={handleTransfer}
          disabled={isDisabled}
        >
          {isDisabled ? "Processing..." : "Transfer"}
        </button>
      </p>
      {feedbackMessage && <p>{feedbackMessage}</p>}
    </div>
  );
}

export default Transfer;
