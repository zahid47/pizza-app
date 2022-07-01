import type { NextPage } from "next";
import Head from "next/head";
// import Image from "next/image";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Pizza App</title>
        <meta name="description" content="yet another pizza shop" />
      </Head>
      
      <h1>hello world</h1>
    </div>
  );
};

export default Home;
