/********Create Products*******/
interface IProduct {
    price: number;
    name: string,
    sku: string
}

class Product implements IProduct {
    price;
    name;
    sku;
    constructor(name: string, sku: string, price: number) {
        this.price = price
        this.name = name
        this.sku = sku
    }
}

const iPad = new Product("Super iPad", "ipd", 549.99);
const mbp = new Product("MacBook Pro", "mbp", 1399.99);
const atv = new Product("Apple TV", "atv", 109.50);
const vga = new Product("VGA adapter", "vga", 30.00);


/********Create Rules*******/
interface IRule {
    sku: string,
    exec: { (quantity: number, rate: number): number };
}

class Rule implements IRule {
    sku: string;
    fnc: any;
    constructor(sku: string, fnc: any) {
        this.sku = sku;
        this.fnc = fnc;
    }

    exec(quantity: number, rate: number): number {
        return this.fnc(quantity, rate);
    }
}



// Rules
const rules = []
rules.push(new Rule('atv', function (quantity: number, rate: number) {
    const a = Math.floor(quantity / 3);
    return (quantity - a) * rate;
}))

rules.push(new Rule('ipd', function (quantity: number, rate: number): number {
    if (quantity > 4) {
        rate = Math.min(rate, 499.99);
    }
    return quantity * rate;
}))



/********Create Checkout*******/
interface ICheckout {
    items: Map<string, {product: Product, quantity: number}>
    rules: Array<Rule>
    scan(product: Product): void;
    total(): number;
}

class Checkout implements ICheckout {
    items: any = new Map();
    rules: Array<Rule>
    constructor(rules: Array<Rule>) {
        this.rules = rules;
    }

    scan(product: Product) {
        if (this.items.has(product.sku)) {
            const { quantity } = this.items.get(product.sku)
            this.items.set(product.sku, { product, quantity: quantity + 1 });
        } else {
            this.items.set(product.sku, { product, quantity: 1 });
        }
    }
    total(): number {
        const processedAmount = new Map();
        
        for (let [sku, detail] of this.items) {
            let anyAvailableOffer = false;

            // Check if any offer matches
            for(let i=0; i<this.rules.length; i++){
                const rule = this.rules
                if(rule[i].sku==sku){
                    // update flag if found any offer
                    anyAvailableOffer = true;
                    const temp = rule[i].exec(detail.quantity, detail.product.price);

                    // update the processed amount (min one) for an SKU for the group of product, eg Product A, Quantity N, Processed Amount PA
                    if(processedAmount.has(sku)){
                        processedAmount.set(sku,Math.min(processedAmount.get(sku),temp));
                    }else{
                        processedAmount.set(sku,temp);
                    }
                }
            }

            // If no offer found;
            if(!anyAvailableOffer){
                processedAmount.set(sku, detail.quantity*detail.product.price) 
            }
        }
        
        let total_amount = 0;
        for(let [sku, amount] of processedAmount){
            total_amount += amount
        }
        return Number(total_amount.toFixed(2))
    }
}


/********Main function*******/
const co = new Checkout(rules)
co.scan(atv)
co.scan(iPad)
co.scan(iPad)
co.scan(atv)
co.scan(iPad)
co.scan(iPad)
co.scan(iPad)

// co.scan(atv)
// co.scan(atv)
// co.scan(atv)
// co.scan(vga)

console.log(co.total())
