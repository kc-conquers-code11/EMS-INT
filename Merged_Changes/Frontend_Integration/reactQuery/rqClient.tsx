import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
    defaultOptions:{
        queries:{
            retry:0,
            refetchOnWindowFocus:false,
        }
    }
});

export const getQueryClient=()=>queryClient;

export const refetchQuery=({queryKey}:{queryKey:string[]})=>{

queryClient.refetchQueries({queryKey})
.then();
}