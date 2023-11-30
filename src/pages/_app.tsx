import "@/styles/globals.css";
import "@mantine/notifications/styles.css";
import "@mantine/core/styles.css";

import { MantineProvider, createTheme } from "@mantine/core";
import axios from "axios";
import { SWRConfig } from "swr";
import { Notifications } from "@mantine/notifications";
import {
  ReactElement,
  ReactNode,
  createContext,
  useContext,
  useState,
} from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import Head from "next/head";
import { parseJson } from "@/utils/parseJson";
import { getCookie } from "cookies-next";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const theme = createTheme({
  /** Put your mantine theme override here */
});

export const UserContext = createContext({});

axios.defaults.baseURL = `${process.env.NEXT_PUBLIC_API_URL}`;
const fetcher = (url: any) => axios.get(url).then((res) => res.data);

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  const [user, setUser] = useState<any>(
    getCookie("user") && parseJson(getCookie("user"))
  );

  return (
    <>
      <Head>
        <title>Quiz App</title>
        <meta name="description" content="Quiz App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SWRConfig
        value={{
          refreshInterval: 3000,
          fetcher,
        }}
      >
        <MantineProvider theme={theme}>
          <Notifications />
          <UserContext.Provider value={{ user, setUser }}>
            {getLayout(<Component {...pageProps} />)}
          </UserContext.Provider>
        </MantineProvider>
      </SWRConfig>
    </>
  );
}
