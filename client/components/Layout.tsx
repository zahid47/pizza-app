import Footer from "./Footer";
import NavBar from "./NavBar";
import Head from "next/head";

export default function Layout({ children }: { children: any }) {
  return (
    <>
      <Head>
        <title>Cheesarella</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <p className="announcement">
        The website is not mobile responsive (yet!!) please view in desktop mode
        for now. Thanks!
      </p>
      <NavBar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
