import React from "react";
import ReactDOM from "react-dom/client";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Toaster} from "sonner";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient({
    defaultOptions: {queries: {staleTime: 30_000, refetchOnWindowFocus: false}, mutations: {retry: 0}},
});

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <App/>
            <Toaster richColors closeButton/>
        </QueryClientProvider>
    </React.StrictMode>
);
