import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <title>MatchRadar - Head to Head Football Stats</title>
        <meta
          name="description"
          content="Compare head-to-head records between football teams across top European leagues."
        />
      </Head>
      <QueryClientProvider client={queryClient}>
        <div className={inter.className}>
          <Component {...pageProps} />
        </div>
      </QueryClientProvider>
    </>
  );
}
