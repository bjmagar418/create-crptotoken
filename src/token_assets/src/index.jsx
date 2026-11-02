import ReactDOM from 'react-dom'
import React from 'react'
import App from "./components/App";
import { AuthClient } from '@dfinity/auth-client';

const init = async () => { 
  ReactDOM.render(<App />, document.getElementById("root"));

  const authClient = await AuthClient.create();

  if(await authClient.isAuthenticated()) {
    // const identity = authClient.getIdentity();
    // console.log("Identity: ", identity);
    handleAuthneticated(authClient);
  } else {
    console.log("Not authenticated");
     await authClient.login({
    identityProvider: "https://identity.ic0.app/#authorize",
    onSuccess: () => {
      handleAuthneticated(authClient);
    },
  });
  }


 
}

async function handleAuthneticated(authClient){
    ReactDOM.render(<App />, document.getElementById("root"));

}

init();


