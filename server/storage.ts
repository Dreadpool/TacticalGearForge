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
      // HOLSTER ADAPTERS - GBRS GROUP APPROVED (FEATURED)
      {
        name: "TRUE NORTH CONCEPTS MODULAR HOLSTER ADAPTER",
        model: "MHA-001-BLK",
        description: "Component of the official GBRS Group belt build-out for mounting a holster. Eliminates unwanted movement, flex, and sliding common to factory polymer belt adaptors by clamping the belt between aluminum adapter and aluminum belt bars.",
        price: "84.99",
        category: "PROTECTION",
        imageUrl: "/api/assets/MC-2048x2048.jpg",
        additionalImages: JSON.stringify([
          "/api/assets/MC-2048x2048.jpg",
          "/api/assets/MHA-Mounted-300x300.webp",
          "/api/assets/MHA-Mounted-2-300x300.webp",
          "/api/assets/MHA-Mounted-3-300x300.webp"
        ]),
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
      
      // CHEST RIGS - TRAVIS HALEY ENDORSED (FORCE RECON MARINE)
      {
        name: "HALEY STRATEGIC D3CRM MICRO CHEST RIG",
        model: "D3CRM-BLK",
        description: "Created by Travis Haley, veteran Force Recon Marine with 15 years of dedicated real-world experience. The D3CRM has earned operational experience with deployments to every branch of the U.S. military including broad usage with U.S./NATO special operations forces, federal, and local law enforcement agencies.",
        price: "189.00",
        category: "LOAD_BEARING",
        imageUrl: "/api/assets/D3CRM-main.png",
        additionalImages: JSON.stringify([
          "/api/assets/D3CRM-main.png",
          "/api/assets/D3CRM-view-2.png",
          "/api/assets/D3CRM-view-3.png",
          "/api/assets/D3CRM-view-4.png"
        ]),
        inStock: true,
        specifications: JSON.stringify({
          creator: "Travis Haley - Force Recon Marine (15 years)",
          experience: "Deployments to every branch of U.S. military",
          users: "U.S./NATO special operations forces, federal and local law enforcement",
          design: "Adaptive to any mission and every environment",
          capacity: "Triple magazine front, admin pouches",
          mounting: "Modular attachment system", 
          material: "Made in USA, Berry Compliant",
          sourceUrl: "https://haleystrategic.com/"
        })
      },
      
      // RED DOT SIGHTS - PAT MCNAMARA ENDORSED (DELTA FORCE)
      {
        name: "AIMPOINT MICRO T-2 RED DOT SIGHT",
        model: "T-2-2MOA",
        description: "Pat McNamara, former Delta Force: 'For optics, he prefers Aimpoint in the T-2 series, though the Aimpoint Comp M5 is also getting great reviews.' Used by U.S. Armed Forces elite assault teams and Special Forces all over the world, regarded as the standard optical sight in most NATO countries.",
        price: "849.00", 
        category: "OPTICS",
        imageUrl: "/api/assets/T2-main.jpg",
        additionalImages: JSON.stringify([
          "/api/assets/T2-main.jpg",
          "/api/assets/T2-view-2.jpg",
          "/api/assets/T2-view-3.jpg",
          "/api/assets/T2-view-4.jpg"
        ]),
        inStock: true,
        specifications: JSON.stringify({
          endorser: "Pat McNamara - Former Delta Force",
          quote: "For optics, he prefers Aimpoint in the T-2 series",
          users: "U.S. Armed Forces elite assault teams, Force Recon, MARSOC, Delta Force, Marine Recon, Green Berets",
          batteryLife: "5+ years constant on",
          reticle: "2 MOA red dot",
          durability: "Submersible to 45 meters",
          mounting: "Micro T-2 footprint",
          status: "Standard optical sight in most NATO countries",
          sourceUrl: "https://americanshootingjournal.com/training-with-ex-delta-force-legend-pat-mcnamara/"
        })
      },
      
      // WEAPON LIGHTS - MULTIPLE SOF ENDORSEMENTS
      {
        name: "SUREFIRE M600DF SCOUT LIGHT DUAL FUEL",
        model: "M600DF-BK", 
        description: "Pat McNamara, former Delta Force: 'prefers mounting tactical lights at the 3 o'clock position using a Surefire scout light.' Mike Glover, Green Beret: 'For illumination, Glover uses the Surefire...because it's slim and easy to carry, rechargeable, and has multiple output intensity settings.'",
        price: "359.00",
        category: "TOOLS",
        imageUrl: "/api/assets/M600DF-main.jpg",
        additionalImages: JSON.stringify([
          "/api/assets/M600DF-main.jpg",
          "/api/assets/M600DF-view-2.jpg",
          "/api/assets/M600DF-view-3.jpg",
          "/api/assets/M600DF-view-4.jpg"
        ]),
        inStock: true,
        specifications: JSON.stringify({
          endorsers: "Pat McNamara (Delta Force), Mike Glover (Green Beret)",
          mcNamaraQuote: "prefers mounting at the 3 o'clock position using a Surefire scout light",
          gloverQuote: "uses the Surefire...because it's slim and easy to carry, rechargeable, and has multiple output intensity settings",
          output: "1,500 lumens",
          fuelType: "Dual fuel - CR123A or 18650 rechargeable",
          runtime: "1.25 hours high / 40 hours low",
          construction: "Mil-Spec hard anodized aluminum",
          mounting: "MIL-STD-1913 Picatinny rail mount",
          sourceUrl: "https://americanshootingjournal.com/training-with-ex-delta-force-legend-pat-mcnamara/"
        })
      },
      
      // BELT SYSTEMS - GBRS GROUP OFFICIAL (TIER 1 OPERATORS)
      {
        name: "GBRS GROUP ASSAULTER BELT SYSTEM V3",
        model: "ABS-V3-MC",
        description: "Designed by GBRS Group, a Veteran-Owned, Tier 1 Training organization composed exclusively of Special Mission Unit Veterans. The V3 utilizes a 2-layer outer belt to create a lightweight, flexible yet rigid platform. Trusted by tier-one operators for high-stakes missions and real-world operational durability.",
        price: "189.00",
        category: "LOAD_BEARING",
        imageUrl: "/api/assets/GBRS-Belt-main.jpg",
        additionalImages: JSON.stringify([
          "/api/assets/GBRS-Belt-main.jpg",
          "/api/assets/GBRS-Belt-view-2.jpg",
          "/api/assets/GBRS-Belt-view-3.jpg",
          "/api/assets/GBRS-Belt-buckle.jpg"
        ]),
        inStock: true,
        specifications: JSON.stringify({
          creators: "GBRS Group - Special Mission Unit Veterans",
          construction: "Type 13, 1-23/32″ webbing rated at 7,000 lbs tensile strength",
          material: "Laser-cut PALS-compatible thermo-polymer laminate",
          buckle: "1.75″ AustriAlpin Cobra® with integrated D-ring",
          innerBelt: "1.5″ scuba webbing for IWB holster support",
          weight: "Medium: 13.8 oz, Small: 12.9 oz",
          molle: "Medium: 20 MOLLE spaces, Small: 17 MOLLE spaces",
          endorsement: "GBRS Group Official Product - Tier 1 Operators",
          usage: "High-stakes missions, CQB drills, fast-roping operations",
          sourceUrl: "https://gbrsgroupgear.com/products/gbrs-group-assaulter-belt-system-v3"
        })
      },
      
      // MAGAZINE POUCHES - ESSTAC KYWI (SPECIAL FORCES PROVEN)
      {
        name: "ESSTAC KYWI 5.56 MAGAZINE POUCH SHORTY",
        model: "5KY56-S-MC",
        description: "Esstac KYWI pouches have been personally used by operators in Kenya, Georgia, The UK and Afghanistan. British Army sharpshooter: 'hands down they've been the best pouches for the job!' Combines traditional nylon durability with modern Kydex retention. Legendary in military and special operations communities.",
        price: "32.00",
        category: "LOAD_BEARING",
        imageUrl: "/api/assets/Esstac-5.56-main.jpg",
        additionalImages: JSON.stringify([
          "/api/assets/Esstac-5.56-main.jpg",
          "/api/assets/Esstac-5.56-side.jpg",
          "/api/assets/Esstac-5.56-mounted.jpg",
          "/api/assets/Esstac-5.56-detail.jpg"
        ]),
        inStock: true,
        specifications: JSON.stringify({
          endorser: "British Army Sharpshooter, Multiple Special Forces Units",
          quote: "hands down they've been the best pouches for the job!",
          users: "Operators in Kenya, Georgia, The UK and Afghanistan",
          construction: "500D nylon exterior with Kydex insert (KYWI design)",
          retention: "Solid retention with satisfying 'click' to hold magazines",
          compatibility: "Standard 5.56/.223 magazines",
          mounting: "MOLLE/PALS compatible",
          noise: "Soft nylon exterior to keep noise down",
          durability: "Proven in combat environments over 2+ years",
          sourceUrl: "https://esstac.com/5-56/"
        })
      },
      
      // MEDICAL GEAR - SOILEATER TOURNIQUET HOLDER (LAW ENFORCEMENT/SWAT)
      {
        name: "SOILEATER BELT MOUNTED TOURNIQUET HOLDER V2",
        model: "BMTH-V2-MC",
        description: "Designed by a law enforcement professional with SWAT experience, certified in explosive breaching and advanced firearms. The BMTH V2 was re-designed for the modern professional, utilizing wasted space on your combat belt for ambidextrous tourniquet access without additional steps in high-stress situations.",
        price: "45.00",
        category: "TOOLS",
        imageUrl: "/api/assets/Soileater-TQ-main.jpg",
        additionalImages: JSON.stringify([
          "/api/assets/Soileater-TQ-main.jpg",
          "/api/assets/Soileater-TQ-mounted.jpg",
          "/api/assets/Soileater-TQ-detail.jpg",
          "/api/assets/Soileater-TQ-access.jpg"
        ]),
        inStock: true,
        specifications: JSON.stringify({
          creator: "Law Enforcement Professional - SWAT Assaulter",
          design: "Ambidextrous access without snaps/velcro/buttons",
          compatibility: "CAT or SOFTT-W tourniquets",
          access: "Simply pull tourniquet towards centerline with either hand",
          mounting: "Loop under belt with hook/MOLLE outer belt",
          additional: "Includes marker, decompression needle or chemlight holder",
          belts: "Does not work with GBRS or Eagle Industries Belts (need reversed version)",
          enhancement: "Adds more velcro real-estate for improved belt stability",
          certifications: "Creator certified in explosive breaching and advanced firearms",
          sourceUrl: "https://www.soileater.com/product-page/bmth-v2"
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
