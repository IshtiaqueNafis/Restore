import {Basket} from "../models/Basket";
import {createContext, PropsWithChildren, useContext, useState} from "react";

interface StoreContextValue {
    basket: Basket | null; // inital state of the basket 
    setBasket: (basket: Basket) => void; // sets basket value, 
    removeItem: (productId: number, quantity: number) => void // remove items from the basket. 
}

export const StoreContext = createContext<StoreContextValue | undefined>(undefined); // crate store context with Value. 

export function useStoreContext() {
    const context = useContext(StoreContext);

    if (context === undefined) {
        throw Error('-oops not inside provider')
    }
    return context;
}

export function StoreProvider({children}: PropsWithChildren<any>) {
    const [basket, setBasket] = useState<Basket | null>(null);

    function removeItem(productId: number, quantity: number) {
        if (!basket) return;
        const items = [...basket.items];
        const itemIndex = items.findIndex(i => i.productId === productId);
        if (itemIndex >= 0) {
            items[itemIndex].quantity -= quantity;
            if (items[itemIndex].quantity === 0) {
                items.splice(itemIndex, 1);
                setBasket(prevstate => {
                    return {...prevstate!, items};
                })
            }
        }
    }

    return (
        <StoreContext.Provider value={{basket, setBasket, removeItem}}>
            {children}
        </StoreContext.Provider>
    )
}