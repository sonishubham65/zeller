# zeller

## Run the code with
`npx ts-node checkout.ts`


## Description
The Product interface and ProductImpl class represent the product information.
The PricingRule interface is introduced to calculate the total amount based on the quantity and rate.
The AtvPricingRule and IpdPricingRule classes implement the PricingRule interface with their specific calculation logic.
The Checkout class encapsulates the logic for scanning products and calculating the total amount based on the pricing rules.
The Checkout class now receives an array of PricingRule objects during construction.


it is resulting as shown here
https://github.com/zhaoyi0113/zeller-backend-ts-coding-challenge
