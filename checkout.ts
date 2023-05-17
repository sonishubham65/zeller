/********Create Products*******/
interface Product {
    price: number;
    name: string,
    sku: string
}

class ProductImplementation implements Product {
    constructor(public name: string, public sku: string, public price: number) { }
}

const ipd = new ProductImplementation("Super iPad", "ipd", 549.99);
const mbp = new ProductImplementation("MacBook Pro", "mbp", 1399.99);
const atv = new ProductImplementation("Apple TV", "atv", 109.50);
const vga = new ProductImplementation("VGA adapter", "vga", 30.00);


/********Create Rules*******/
interface PricingRule {
    sku: string
    calculatePrice(quantity: number, rate: number): number ;
}

class AtvPricingRule implements PricingRule {
    sku = 'atv'
    constructor() {
    }

    calculatePrice(quantity: number, rate: number): number {
        const a = Math.floor(quantity / 3);
        return (quantity - a) * rate;
    }
}

class IpdPricingRule implements PricingRule {
    sku = 'ipd'
    constructor() {
    }
    calculatePrice(quantity: number, rate: number): number {
      if (quantity > 4) {
        rate = Math.min(rate, 499.99);
      }
      return quantity * rate;
    }
  }
  



/********Create Checkout*******/
interface ICheckout {
    items: Map<string, {product: Product, quantity: number}>
    rules: Array<PricingRule>
    scan(product: Product): void;
    total(): number;
}

class Checkout {
    private items: Map<string, { product: Product; quantity: number }>;
    private rules: Map<string, PricingRule>;
  
    constructor(private pricingRules: PricingRule[]) {
      this.items = new Map();
      this.rules = new Map();
  
      for (const rule of pricingRules) {
        this.rules.set(rule.sku, rule);
      }
    }
  
    scan(product: Product) {
      if (this.items.has(product.sku)) {
        const { quantity } = this.items.get(product.sku)!;
        this.items.set(product.sku, { product, quantity: quantity + 1 });
      } else {
        this.items.set(product.sku, { product, quantity: 1 });
      }
    }
  
    total(): number {
      const processedAmount = new Map<string, number>();
  
      for (const [sku, detail] of this.items) {
        const pricingRule = this.rules.get(sku);
        if (pricingRule) {
          const temp = pricingRule.calculatePrice(detail.quantity, detail.product.price);
          if (processedAmount.has(sku)) {
            processedAmount.set(sku, Math.min(processedAmount.get(sku)!, temp));
          } else {
            processedAmount.set(sku, temp);
          }
        } else {
          processedAmount.set(sku, detail.quantity * detail.product.price);
        }
      }
  
      let totalAmount = 0;
      for (const amount of processedAmount.values()) {
        totalAmount += amount;
      }
  
      return Number(totalAmount.toFixed(2));
    }
  }
  

/********Main function*******/
const pricingRules: PricingRule[] = [
    new AtvPricingRule(),
    new IpdPricingRule(),
  ];
  const checkout = new Checkout(pricingRules);
  checkout.scan(atv);
  checkout.scan(ipd);
  checkout.scan(ipd);
  checkout.scan(atv);
  checkout.scan(ipd);
  checkout.scan(ipd);
  checkout.scan(ipd);

// checkout.scan(atv)
// checkout.scan(atv)
// checkout.scan(atv)
// checkout.scan(vga)
  
  console.log(checkout.total());
