"use client";
import { config, queryClient } from "@/config";
import { AlchemyAccountProvider } from "@account-kit/react";
import { QueryClientProvider } from "@tanstack/react-query";
export const Providers = (props) => {
    return (<QueryClientProvider client={queryClient}>
      <AlchemyAccountProvider config={config} queryClient={queryClient} initialState={props.initialState}>
        {props.children}
      </AlchemyAccountProvider>
    </QueryClientProvider>);
};
