import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
const badgeVariants = cva("inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:scale-105", {
    variants: {
        variant: {
            default: "border-transparent bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg hover:shadow-xl animate-pulse-glow",
            secondary: "border-transparent bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground shadow-lg hover:shadow-xl",
            destructive: "border-transparent bg-gradient-to-r from-destructive to-destructive/90 text-destructive-foreground shadow-lg hover:shadow-xl",
            outline: "text-foreground border-2 border-primary hover:bg-primary hover:text-primary-foreground",
            glow: "border-transparent bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-glow hover:shadow-2xl animate-pulse-glow"
        },
    },
    defaultVariants: {
        variant: "default",
    },
});
function Badge({ className, variant, ...props }) {
    return (<div className={cn(badgeVariants({ variant }), className)} {...props}/>);
}
export { Badge, badgeVariants };
