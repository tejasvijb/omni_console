import { authQueryOptions } from "@/api-config/queryOptions/authQueries";
import { userLogout } from "@/api-config/endpoints/authApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useAuth = () => {
    // Implementation of authentication hook
    const router = useRouter();
    const queryClient = useQueryClient();

    const {
        data: currentUserData,
        isLoading: isCurrentUserLoading,
        isSuccess: isCurrentUserAuthenticated,
    } = useQuery({
        queryFn: authQueryOptions.fetchCurrentUserOptions.queryFn,
        queryKey: authQueryOptions.fetchCurrentUserOptions.queryKey,
        refetchOnMount: "always",
        refetchOnWindowFocus: true,
        retry: false,
    });

    const { mutate: logout, isPending: isLoggingOut } = useMutation({
        mutationFn: userLogout,
        onSuccess: () => {
            // Clear auth cache
            queryClient.invalidateQueries({
                queryKey: authQueryOptions.fetchCurrentUserOptions.queryKey,
            });
            // Redirect to sign-in
            router.push("/sign-in");
        },
    });

    return {
        currentUserData,
        isCurrentUserLoading,
        isCurrentUserAuthenticated,
        logout,
        isLoggingOut,
    };
};
