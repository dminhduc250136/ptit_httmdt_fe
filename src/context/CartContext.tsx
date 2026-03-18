"use client";

import {
    createContext,
    useContext,
    useReducer,
    useState,
    useEffect,
    useCallback,
    type ReactNode,
} from "react";
import type { Product } from "@/lib/types";
import { AUTH_CHANGED_EVENT, getStoredUser } from "@/lib/authStorage";

export interface CartItem {
    product: Product;
    quantity: number;
}

interface CartState {
    items: CartItem[];
}

type CartAction =
    | { type: "ADD_ITEM"; product: Product }
    | { type: "REMOVE_ITEM"; productId: number }
    | { type: "UPDATE_QTY"; productId: number; quantity: number }
    | { type: "SET_ITEMS"; items: CartItem[] }
    | { type: "CLEAR" };

function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case "ADD_ITEM": {
            const exists = state.items.find((i) => i.product.id === action.product.id);
            if (exists) {
                return {
                    items: state.items.map((i) =>
                        i.product.id === action.product.id
                            ? { ...i, quantity: Math.min(i.quantity + 1, 10) }
                            : i
                    ),
                };
            }
            return { items: [...state.items, { product: action.product, quantity: 1 }] };
        }
        case "REMOVE_ITEM":
            return { items: state.items.filter((i) => i.product.id !== action.productId) };
        case "UPDATE_QTY": {
            if (action.quantity <= 0) {
                return { items: state.items.filter((i) => i.product.id !== action.productId) };
            }
            return {
                items: state.items.map((i) =>
                    i.product.id === action.productId
                        ? { ...i, quantity: Math.min(action.quantity, 10) }
                        : i
                ),
            };
        }
        case "CLEAR":
            return { items: [] };
        case "SET_ITEMS":
            return { items: action.items };
        default:
            return state;
    }
}

interface CartContextValue {
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
    addItem: (product: Product) => void;
    removeItem: (productId: number) => void;
    updateQty: (productId: number, quantity: number) => void;
    clearCart: () => void;
    /** Items the user selected for checkout — set just before navigating to /checkout */
    checkoutItems: CartItem[];
    setCheckoutItems: (items: CartItem[]) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY_PREFIX = "laptopverse_cart_user_";

function getStorageKeyForCurrentUser(): string | null {
    const user = getStoredUser();
    if (!user?.id) return null;
    return `${STORAGE_KEY_PREFIX}${user.id}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(cartReducer, { items: [] });
    const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);
    const [storageKey, setStorageKey] = useState<string | null>(null);

    useEffect(() => {
        const syncCartByAuth = () => {
            const nextKey = getStorageKeyForCurrentUser();
            setStorageKey(nextKey);

            if (!nextKey) {
                dispatch({ type: "CLEAR" });
                setCheckoutItems([]);
                return;
            }

            try {
                const saved = localStorage.getItem(nextKey);
                const parsed = saved ? (JSON.parse(saved) as CartItem[]) : [];
                dispatch({ type: "SET_ITEMS", items: parsed });
                setCheckoutItems([]);
            } catch {
                dispatch({ type: "SET_ITEMS", items: [] });
            }
        };

        syncCartByAuth();
        window.addEventListener(AUTH_CHANGED_EVENT, syncCartByAuth);
        window.addEventListener("storage", syncCartByAuth);
        return () => {
            window.removeEventListener(AUTH_CHANGED_EVENT, syncCartByAuth);
            window.removeEventListener("storage", syncCartByAuth);
        };
    }, []);

    // Persist to localStorage on change
    useEffect(() => {
        if (!storageKey) return;
        try {
            localStorage.setItem(storageKey, JSON.stringify(state.items));
        } catch { }
    }, [state.items, storageKey]);

    const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = state.items.reduce(
        (sum, i) => sum + i.product.price * i.quantity,
        0
    );

    const addItem = useCallback(
        (product: Product) => dispatch({ type: "ADD_ITEM", product }),
        []
    );
    const removeItem = useCallback(
        (productId: number) => dispatch({ type: "REMOVE_ITEM", productId }),
        []
    );
    const updateQty = useCallback(
        (productId: number, quantity: number) =>
            dispatch({ type: "UPDATE_QTY", productId, quantity }),
        []
    );
    const clearCart = useCallback(() => dispatch({ type: "CLEAR" }), []);

    return (
        <CartContext.Provider
            value={{
                items: state.items,
                totalItems,
                totalPrice,
                addItem,
                removeItem,
                updateQty,
                clearCart,
                checkoutItems,
                setCheckoutItems,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart(): CartContextValue {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
    return ctx;
}
