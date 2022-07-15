import Head from "next/head";
import Footer from "../components/Footer";
import NavBar from "./NavBar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Head>
        <title>The Rolling Dough</title>
        <meta name="description" content="The Rolling Dough App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {children}
      <Footer />
    </>
  );
}
