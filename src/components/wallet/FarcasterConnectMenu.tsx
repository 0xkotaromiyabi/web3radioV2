import React from "react";
import { createThirdwebClient } from "thirdweb";
import { base } from "thirdweb/chains";
import { BuyWidget } from "thirdweb/react";

const client = createThirdwebClient({
  clientId: "ac0e7bf99e676e48fa3a2d9f4c33089c",
});

const TOKEN_ADDRESS =
  "0x18bc5bcc660cf2b9ce3cd51a404afe1a0cbd3c22";

const BuyIDRXWidget = () => (
  <BuyWidget
    client={client}
    chain={base}
    amount="0.002"
    tokenAddress={TOKEN_ADDRESS}
    title="Buy IDRX Token"
    // Anda bisa menambahkan props lain seperti theme, onSuccess, onError, dsb.
  />
);

export default BuyIDRXWidget;
