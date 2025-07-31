import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const CLIENT_ID = "ac0e7bf99e676e48fa3a2d9f4c33089c";
const PROJECT_ID = "prj_cmbp08mgv018saj0k1galvt3w";
const CHAIN_ID = 8453; // Base chain
const TOKEN_ADDRESS =
  "0x18bc5bcc660cf2b9ce3cd51a404afe1a0cbd3c22";
const SELLER = "0x0000000000000000000000000000000000000000";

const buyUrl = `https://embed.thirdweb.com/buy?clientId=${CLIENT_ID}&projectId=${PROJECT_ID}&chainId=${CHAIN_ID}&tokenAddress=${TOKEN_ADDRESS}&amount=0.002&seller=${SELLER}&currency=USD&theme=dark&primaryColor=%2300ff00`;

const BuyIDRXWidget = () => (
  <Card className="p-4 bg-gradient-to-r from-[#1a1a1a] to-[#333] border-[#555]">
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white">
          Buy IDRX Token
        </h3>
        <Badge
          variant="outline"
          className="bg-[#111] text-blue-400 border-[#333]"
        >
          Base Chain
        </Badge>
      </div>
      <div className="text-xs text-gray-400 mb-3">
        Purchase IDRX tokens directly on Base network
      </div>
      <div className="w-full rounded-lg overflow-hidden border border-[#444]">
        <iframe
          src={buyUrl}
          width="100%"
          height="500"
          style={{ border: "none" }}
          className="bg-[#000]"
          loading="lazy"
          title="Buy IDRX"
        ></iframe>
      </div>
    </div>
  </Card>
);

export default BuyIDRXWidget;
