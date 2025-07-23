import { 
  users, 
  products, 
  cartItems,
  type User, 
  type InsertUser, 
  type Product, 
  type InsertProduct,
  type CartItem,
  type InsertCartItem,
  type CartItemWithProduct
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Cart
  getCartItems(userId?: number): Promise<CartItemWithProduct[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(userId?: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private cartItems: Map<number, CartItem>;
  private currentUserId: number;
  private currentProductId: number;
  private currentCartId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.cartItems = new Map();
    this.currentUserId = 1;
    this.currentProductId = 1;
    this.currentCartId = 1;
    
    // Initialize with tactical gear products
    this.initializeProducts();
  }

  private initializeProducts() {
    const tacticalProducts: InsertProduct[] = [
      // HOLSTER SYSTEMS - Verified Military Contracts
      {
        name: "SAFARILAND 7360 7TS ALS/SLS HOLSTER",
        model: "7360-450-551",
        description: "US Army official M17 holster system. Level III retention with ALS (Automatic Locking System) and SLS rotating hood. Part of MHHC (Modular Handgun Holster Kit) contract.",
        price: "169.99",
        category: "PROTECTION",
        imageUrl: "https://images.unsplash.com/photo-1595590424283-b8f17842773f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        inStock: true,
        specifications: JSON.stringify({
          retention: "Level III",
          material: "SafariSeven 7TS",
          mounting: "QLS Fork compatible",
          contract: "Army MHHC Program",
          nsn: "Available",
          berryCompliant: true
        })
      },
      {
        name: "BLACKHAWK SERPA TACTICAL HOLSTER",
        model: "430600BK-R",
        description: "US military $24M contract holster. 8,400+ units delivered to Army and Marine Corps. Berry Amendment compliant with patented SERPA Auto Lock release.",
        price: "89.99",
        category: "PROTECTION",
        imageUrl: "https://images.unsplash.com/photo-1584633855574-feae321722e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        inStock: true,
        specifications: JSON.stringify({
          retention: "Level II",
          material: "Carbon Fiber Composite",
          mounting: "MOLLE/Belt/Drop-leg",
          contract: "$24M Military Contract",
          deliveredUnits: "8,400+",
          berryCompliant: true
        })
      },
      
      // BACKPACKS - SOCOM Verified
      {
        name: "MYSTERY RANCH 3-DAY ASSAULT PACK",
        model: "MR-3DAP-COY",
        description: "SOCOM continuous contract holder since 2004. Tested with 3rd Battalion Rangers through Army Operational Test Command. Airborne operations certified.",
        price: "449.99",
        category: "LOAD BEARING",
        imageUrl: "https://images.unsplash.com/photo-1622260614927-208cfe3f5cfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        inStock: true,
        specifications: JSON.stringify({
          capacity: "3,200 cubic inches",
          material: "500D Cordura",
          frame: "Futura Yoke",
          contract: "SOCOM since 2004",
          testing: "3rd Battalion Rangers",
          berryCompliant: true
        })
      },
      {
        name: "MYSTERY RANCH SPEAR PATROL PACK",
        model: "MR-SPEAR-PATROL",
        description: "SOCOM SPEAR program selection October 2016. 5,000 cubic inch capacity for extended operations. Part of 3-pack system for special operations forces.",
        price: "649.99",
        category: "LOAD BEARING",
        imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        inStock: true,
        specifications: JSON.stringify({
          capacity: "5,000 cubic inches",
          program: "SOCOM SPEAR",
          material: "500D Cordura",
          features: "BVS system, PALS webbing",
          contract: "Selected October 2016",
          berryCompliant: true
        })
      },
      {
        name: "EAGLE INDUSTRIES FILBE 3-DAY ASSAULT",
        model: "EI-A-III-MS-COY",
        description: "Current USMC issue assault pack. NSN 8465-01-600-7830. Part of Family of Improved Load Bearing Equipment system.",
        price: "289.99",
        category: "LOAD BEARING",
        imageUrl: "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        inStock: true,
        specifications: JSON.stringify({
          nsn: "8465-01-600-7830",
          capacity: "3,000 cubic inches",
          material: "725 Denier Cordura",
          issue: "USMC Standard",
          features: "Assault pack lid, sustainment pouches",
          berryCompliant: true
        })
      },
      
      // OPTICS MOUNTS - SOPMOD Program
      {
        name: "LARUE TACTICAL LT840-34",
        model: "LT840-34",
        description: "USMC Scout Sniper Day Scope mount. 2,800+ units ordered for M110/M107 rifles. NSN 1240-01-620-2353, CAGE code 5YS77.",
        price: "329.99",
        category: "OPTICS",
        imageUrl: "https://images.unsplash.com/photo-1584109410918-d019eed22b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        inStock: true,
        specifications: JSON.stringify({
          nsn: "1240-01-620-2353",
          cageCode: "5YS77",
          mounting: "34mm QD",
          contract: "USMC Scout Sniper",
          unitsOrdered: "2,800+",
          compatibility: "M110/M107"
        })
      },
      {
        name: "KNIGHT'S ARMAMENT M110 SASS MOUNT",
        model: "KAC-25781",
        description: "Part of $16.5M M110 SASS overhaul contract. 1,725 rifles equipped. Integral to SOPMOD program since Block I.",
        price: "449.99",
        category: "OPTICS",
        imageUrl: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        inStock: true,
        specifications: JSON.stringify({
          mounting: "30mm",
          program: "SOPMOD Block I",
          contract: "$16.5M overhaul",
          nsn: "Multiple assigned",
          unitsIssued: "1,000,000+ (all KAC)",
          compatibility: "M110 SASS"
        })
      },
      {
        name: "GEISSELE SUPER PRECISION MOUNT",
        model: "SP-30MM-BLK",
        description: "Serves top-tier military throughout USSOCOM. Part of $29.3M MRGG-S contract H92403-23-D-0003, 10-year ordering period.",
        price: "325.00",
        category: "OPTICS",
        imageUrl: "https://images.unsplash.com/photo-1609207753431-e5e7c5f3c66f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        inStock: true,
        specifications: JSON.stringify({
          mounting: "30mm",
          contract: "$29.3M SOCOM",
          contractNumber: "H92403-23-D-0003",
          program: "MRGG-S Mk1 Mod0",
          material: "7075-T6 Aluminum",
          users: "USSOCOM"
        })
      },
      
      // TACTICAL ACCESSORIES
      {
        name: "BLUE FORCE GEAR VICKERS SLING",
        model: "VCAS-2TO1-200-CB",
        description: "100,000+ issued across US Armed Forces. NSN 1005-01-604-0627. Validated through Marine Corps combat trials in Afghanistan.",
        price: "54.99",
        category: "TOOLS",
        imageUrl: "https://images.unsplash.com/photo-1619686016809-c5b00afc9619?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        inStock: true,
        specifications: JSON.stringify({
          nsn: "1005-01-604-0627",
          unitsIssued: "100,000+",
          validation: "USMC Afghanistan trials",
          material: "Mil-spec webbing",
          hardware: "ITW Nexus",
          authorization: "M4/M16 series"
        })
      },
      {
        name: "MAGPUL PMAG 30 GEN M3",
        model: "MAG556-MCT",
        description: "NSN 1005-01-659-7086. Marine Corps 4-year testing: 20,400 rounds without stoppage. Army authorized via TACOM 17-045.",
        price: "19.99",
        category: "TOOLS",
        imageUrl: "https://images.unsplash.com/photo-1584109410918-d019eed22b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        inStock: true,
        specifications: JSON.stringify({
          nsn: "1005-01-659-7086",
          capacity: "30 rounds",
          testing: "20,400 rounds no stoppage",
          authorization: "TACOM 17-045",
          material: "Impact resistant polymer",
          compatibility: "STANAG 4179"
        })
      },
      {
        name: "INSIGHT ATPIAL-C LASER",
        model: "ATP-000-A18",
        description: "Civilian version of AN/PEQ-15 (NSN 5855-01-577-7174). Standard laser aiming module since 2003, part of SOPMOD Block I.",
        price: "1,485.00",
        category: "OPTICS",
        imageUrl: "https://images.unsplash.com/photo-1609207825181-fbf1f8ec3c66?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        inStock: true,
        specifications: JSON.stringify({
          civilianModel: "ATPIAL-C",
          militaryDesignation: "AN/PEQ-15",
          nsn: "5855-01-577-7174",
          program: "SOPMOD Block I",
          laser: "Class IIIa visible/IR",
          mounting: "MIL-STD-1913"
        })
      },
      
      // HOLSTER ADAPTERS - GBRS GROUP APPROVED
      {
        name: "TRUE NORTH CONCEPTS MODULAR HOLSTER ADAPTER",
        model: "MHA-001-BLK",
        description: "Component of the official GBRS Group belt build-out for mounting a holster. Eliminates unwanted movement, flex, and sliding common to factory polymer belt adaptors by clamping the belt between aluminum adapter and aluminum belt bars.",
        price: "84.99",
        category: "PROTECTION",
        imageUrl: "/api/assets/MHA-scaled.jpg",
        inStock: true,
        specifications: JSON.stringify({
          material: "DFARS grade 6061-T6 aluminum",
          thickness: "0.190″ thick domestically produced aluminum",
          finish: "Type 3 MIL-SPEC hard coat anodized",
          weight: "2 oz heavier than UBL",
          cantAdjustment: "20° total range (10° forward + 10° negative)",
          heightAdjustment: "Three mounting points set 1/2″ apart",
          beltCompatibility: "Up to 2.25″ wide belts",
          mounting: "MOLLE/PALS, standard belt, Tek-Lok™, MALICE clips",
          holsterCompatibility: "Safariland 3-hole pattern, QLS/MLS/ELS, G-Code SOC/OSL/XST",
          endorsement: "GBRS Group Official Component",
          warranty: "Lifetime replacement guarantee",
          berryCompliant: true
        })
      },
      
      // ADDITIONAL VERIFIED ITEMS
      {
        name: "CRYE PRECISION AVS 1000 PACK",
        model: "BLC-BAG-AVS1K0-COY",
        description: "Ballistic plate compatible assault pack. Urban-optimized profile based on special operations input. Integrates with AVS harness system.",
        price: "385.00",
        category: "LOAD BEARING",
        imageUrl: "https://images.unsplash.com/photo-1609748341237-85f457d1e3d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        inStock: true,
        specifications: JSON.stringify({
          capacity: "1000 cubic inches",
          compatibility: "AVS Harness",
          features: "Zip-on panel system",
          material: "500D Cordura",
          design: "SOF urban ops input",
          plateCompatible: true
        })
      },
      {
        name: "WILCOX G11 NVG MOUNT",
        model: "28300G11",
        description: "Army-approved standard for AN/PVS-14. NSN 5855-01-610-8704. Breakaway feature for airborne operations.",
        price: "449.00",
        category: "OPTICS",
        imageUrl: "https://images.unsplash.com/photo-1584633855574-feae321722e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        inStock: true,
        specifications: JSON.stringify({
          nsn: "5855-01-610-8704",
          compatibility: "AN/PVS-14",
          mounting: "One-hole Strap",
          feature: "Breakaway for airborne",
          approval: "Army standard",
          material: "Aluminum/polymer"
        })
      }
    ];

    tacticalProducts.forEach(product => {
      this.createProduct(product);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.category === category
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = { 
      ...insertProduct, 
      id,
      inStock: insertProduct.inStock ?? true,
      specifications: insertProduct.specifications ?? null
    };
    this.products.set(id, product);
    return product;
  }

  async getCartItems(userId?: number): Promise<CartItemWithProduct[]> {
    const items = Array.from(this.cartItems.values())
      .filter(item => !userId || item.userId === userId);
    
    const itemsWithProducts: CartItemWithProduct[] = [];
    for (const item of items) {
      const product = this.products.get(item.productId);
      if (product) {
        itemsWithProducts.push({ ...item, product });
      }
    }
    
    return itemsWithProducts;
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const existingItem = Array.from(this.cartItems.values()).find(
      item => item.productId === insertItem.productId && 
               item.userId === insertItem.userId
    );

    if (existingItem) {
      // Update quantity instead of creating new item
      existingItem.quantity += insertItem.quantity || 1;
      this.cartItems.set(existingItem.id, existingItem);
      return existingItem;
    }

    const id = this.currentCartId++;
    const cartItem: CartItem = { 
      ...insertItem, 
      id,
      userId: insertItem.userId || null,
      quantity: insertItem.quantity || 1
    };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (item) {
      item.quantity = quantity;
      this.cartItems.set(id, item);
      return item;
    }
    return undefined;
  }

  async removeFromCart(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(userId?: number): Promise<void> {
    if (userId) {
      const itemsToDelete = Array.from(this.cartItems.entries())
        .filter(([_, item]) => item.userId === userId)
        .map(([id, _]) => id);
      
      itemsToDelete.forEach(id => this.cartItems.delete(id));
    } else {
      this.cartItems.clear();
    }
  }
}

export const storage = new MemStorage();
