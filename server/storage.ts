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
      {
        name: "TACTICAL PLATE CARRIER",
        model: "TV-001",
        description: "Multi-threat ballistic protection with modular attachment system. NIJ Level IIIA certified.",
        price: "299.99",
        category: "PROTECTION",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        inStock: true,
        specifications: JSON.stringify({
          material: "Ballistic Nylon",
          protection: "NIJ Level IIIA",
          weight: "2.5 lbs",
          color: "Black/Tan"
        })
      },
      {
        name: "COMBAT BOOTS MK-II",
        model: "CB-002",
        description: "Waterproof tactical boots with reinforced steel toe and slip-resistant sole.",
        price: "189.99",
        category: "FOOTWEAR",
        imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        inStock: true,
        specifications: JSON.stringify({
          material: "Full Grain Leather",
          waterproof: true,
          sole: "Vibram",
          protection: "Steel Toe"
        })
      },
      {
        name: "ASSAULT PACK 40L",
        model: "BP-003",
        description: "Heavy-duty tactical backpack with MOLLE system and hydration compatibility.",
        price: "149.99",
        category: "LOAD BEARING",
        imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        inStock: true,
        specifications: JSON.stringify({
          capacity: "40L",
          material: "1000D Cordura",
          features: "MOLLE, Hydration Compatible",
          weight: "3.2 lbs"
        })
      },
      {
        name: "TACTICAL HELMET",
        model: "TH-004",
        description: "Lightweight ballistic helmet with rail system for accessories.",
        price: "399.99",
        category: "PROTECTION",
        imageUrl: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        inStock: true,
        specifications: JSON.stringify({
          protection: "NIJ Level IIIA",
          weight: "3.1 lbs",
          rail: "Picatinny Compatible",
          padding: "7-pad system"
        })
      },
      {
        name: "NIGHT VISION SCOPE",
        model: "NV-005",
        description: "Digital night vision scope with 4x magnification and recording capability.",
        price: "899.99",
        category: "OPTICS",
        imageUrl: "https://images.unsplash.com/photo-1572978281370-a03c4c4e3ea2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        inStock: true,
        specifications: JSON.stringify({
          magnification: "4x",
          detection: "300m",
          battery: "8 hours",
          recording: "1080p"
        })
      },
      {
        name: "TACTICAL KNIFE",
        model: "TK-006",
        description: "Fixed blade tactical knife with ergonomic handle and MOLLE sheath.",
        price: "79.99",
        category: "TOOLS",
        imageUrl: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        inStock: true,
        specifications: JSON.stringify({
          blade: "440C Stainless Steel",
          length: "7 inches",
          handle: "G10",
          sheath: "MOLLE Compatible"
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
