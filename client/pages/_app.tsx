import "../styles/globals.css";
import Layout from "../components/Layout";
import { AppProps } from "next/app";

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
