import Head from "next/head";
import React from "react";
import styles from "../styles/modules/Main.module.scss";
import Nav from "./components/Nav";
import Main from "./components/Main";
import About from "./components/About";
import Footer from "./components/Footer";

export default function Home() {

  return (
    <div className={styles.container}>
      <Head>
        <title>Tibor Bálint's Portfolio</title>
        <meta name="description" content="Generated &amp; Developed by F3" />
        <link rel="icon" href="/favicon-32x32.png" />
      </Head>

      <Nav />
      <div id='home'><Main /></div>
      <div id='about'><About /></div>
      <Footer />
    </div>
  )
}
