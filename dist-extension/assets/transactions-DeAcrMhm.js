import{d as f,i as a,b as p,a as d}from"./vendor-reown-Bwym5ktI.js";import"./index-DuNFVP-2.js";import"./vendor-solana-CNam3Qu9.js";import"./vendor-react-C1_IFK5p.js";import"./vendor-wagmi-D3eR__VX.js";import"./vendor-ui-DTnz5oem.js";const m=f`
  :host > wui-flex:first-child {
    height: 500px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
  }

  :host > wui-flex:first-child::-webkit-scrollbar {
    display: none;
  }
`;var u=function(o,t,i,n){var r=arguments.length,e=r<3?t:n===null?n=Object.getOwnPropertyDescriptor(t,i):n,l;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(o,t,i,n);else for(var s=o.length-1;s>=0;s--)(l=o[s])&&(e=(r<3?l(e):r>3?l(t,i,e):l(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e};let c=class extends a{render(){return p`
      <wui-flex flexDirection="column" .padding=${["0","3","3","3"]} gap="3">
        <w3m-activity-list page="activity"></w3m-activity-list>
      </wui-flex>
    `}};c.styles=m;c=u([d("w3m-transactions-view")],c);export{c as W3mTransactionsView};
