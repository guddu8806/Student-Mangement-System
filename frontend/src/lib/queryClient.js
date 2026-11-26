import {QueryClient} from "@tanstack/react-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 10,
            gcTime: 1000 * 60 * 5,

            refetchOnWindowFocus: false,
            retry: 1
        }
    }
});

export default queryClient;