"use client";

import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "@/store/store";
import Wishlist from "@/components/landing/Wishlist";

export default function WishlistPage() {
    return (
        <PersistGate persistor={persistor} loading={null}>
            <Wishlist />
        </PersistGate>
    );
}
