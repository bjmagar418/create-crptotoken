import React, { useState } from "react";
import { Principal } from "@dfinity/principal";
import { token } from "../../../declarations/token";

function Balance() {
  const [inputValue, setInputValue] = useState("");
  const [balanceResult, setBalance] = useState("");
  const [cryptoSymbol, setSymbol] = useState("");
  const [isHidden, setHidden] = useState(true); // Fixed: initialized as true (hidden by default)

  async function handleClick() {
    try {
      const trimmedInput = inputValue.trim();

      // Guard clause: prevent execution if input is empty
      if (!trimmedInput) {
        alert("Please enter a valid Principal ID.");
        return;
      }

      const principal = Principal.fromText(trimmedInput);
      const balance = await token.balanceOf(principal);
      
      setBalance(balance.toLocaleString());
      setSymbol(await token.getSymbol());
      setHidden(false); // Show the result container now
    } catch (error) {
      console.error("Invalid Principal ID:", error);
      alert("Invalid Principal ID format. Please check and try again.");
    }
  }

  return (
    <div className="window white">
      <label>Check account token balance:</label>
      <p>
        <input
          id="balance-principal-id"
          type="text"
          placeholder="Enter a Principal ID"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </p>
      <p className="trade-buttons">
        <button
          id="btn-request-balance"
          onClick={handleClick}
        >
          Check Balance
        </button>
      </p>
      <p hidden={isHidden}>This account has a balance of {balanceResult} {cryptoSymbol}.</p>
    </div>
  );
}

export default Balance;