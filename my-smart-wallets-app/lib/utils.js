import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
export function formatAddress(address) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
