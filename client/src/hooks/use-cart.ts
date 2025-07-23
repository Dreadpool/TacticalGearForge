import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useCartStore } from '@/lib/cart-store';
import type { CartItemWithProduct, InsertCartItem } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

export function useCart() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { items, setItems, addItem: addToStore, updateItem, removeItem, clearCart } = useCartStore();

  // Fetch cart items from server
  const { data: serverItems, isLoading } = useQuery<CartItemWithProduct[]>({
    queryKey: ['/api/cart'],
  });

  // Add item to cart mutation
  const addMutation = useMutation({
    mutationFn: async (item: InsertCartItem) => {
      return apiRequest('POST', '/api/cart', item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      toast({
        title: "Added to Cart",
        description: "Item has been added to your tactical loadout.",
        className: "bg-night-vision text-ops-black font-mono",
      });
    },
    onError: () => {
      toast({
        title: "Operation Failed",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
        className: "font-mono",
      });
    },
  });

  // Update cart item mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: number; quantity: number }) => {
      return apiRequest('PUT', `/api/cart/${id}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    },
  });

  // Remove item mutation
  const removeMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('DELETE', `/api/cart/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      toast({
        title: "Item Removed",
        description: "Item has been removed from your tactical loadout.",
        className: "bg-danger-red text-white font-mono",
      });
    },
  });

  // Clear cart mutation
  const clearMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('DELETE', '/api/cart');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      clearCart();
      toast({
        title: "Cart Cleared",
        description: "All items have been removed from your tactical loadout.",
        className: "bg-steel-gray text-white font-mono",
      });
    },
  });

  return {
    items: serverItems || items,
    isLoading,
    addItem: (productId: number, quantity: number = 1) => {
      addMutation.mutate({ productId, quantity, userId: undefined });
    },
    updateItem: (id: number, quantity: number) => {
      updateMutation.mutate({ id, quantity });
    },
    removeItem: (id: number) => {
      removeMutation.mutate(id);
    },
    clearCart: () => {
      clearMutation.mutate();
    },
    getTotalPrice: () => {
      const currentItems = serverItems || items;
      return currentItems.reduce(
        (total: number, item) => total + parseFloat(item.product.price) * item.quantity,
        0
      );
    },
    getTotalItems: () => {
      const currentItems = serverItems || items;
      return currentItems.reduce((total: number, item) => total + item.quantity, 0);
    },
  };
}
