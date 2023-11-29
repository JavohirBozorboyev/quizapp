import Head from "next/head";
import { Inter } from "next/font/google";
import AppLayout from "@/layout/AppLayout";
import { ReactElement } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return <>salom</>;
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
