import { useSmartAccountClient } from "@account-kit/react";
import { useQuery } from "@tanstack/react-query";
import { NFT_MINTABLE_ABI_PARSED } from "@/lib/constants";
export const useReadNFTData = (props) => {
    const { contractAddress, ownerAddress } = props;
    const { client } = useSmartAccountClient({});
    const { data: uri, isLoading: isLoadingUri, error: uriError, } = useQuery({
        queryKey: ["nftBaseURI", contractAddress, client?.chain?.id],
        queryFn: async () => {
            if (!client) {
                throw new Error("Smart account client not ready");
            }
            if (!contractAddress) {
                throw new Error("Contract address is not defined for queryFn.");
            }
            const baseUriString = await client.readContract({
                address: contractAddress,
                abi: NFT_MINTABLE_ABI_PARSED,
                functionName: "baseURI",
            });
            return baseUriString;
        },
        enabled: !!client && !!contractAddress,
    });
    // Query for NFT count
    const { data: count, isLoading: isLoadingCount, error: countError, refetch: refetchCount, } = useQuery({
        queryKey: ["nftBalance", contractAddress, ownerAddress, client?.chain?.id],
        queryFn: async () => {
            if (!client) {
                throw new Error("Smart account client not ready");
            }
            if (!contractAddress) {
                throw new Error("Contract address is not defined for queryFn.");
            }
            if (!ownerAddress) {
                throw new Error("Owner address is not defined for queryFn.");
            }
            const balance = await client.readContract({
                address: contractAddress,
                abi: NFT_MINTABLE_ABI_PARSED,
                functionName: "balanceOf",
                args: [ownerAddress],
            });
            return Number(balance);
        },
        enabled: !!client && !!contractAddress && !!ownerAddress,
    });
    return {
        uri,
        count,
        isLoading: isLoadingUri || isLoadingCount,
        isLoadingUri,
        isLoadingCount,
        error: uriError || countError,
        uriError,
        countError,
        refetchCount,
    };
};
