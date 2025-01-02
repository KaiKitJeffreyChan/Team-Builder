import type { AppType } from "next/app";
import "../styles/globals.css";
import Head from "next/head";
import React from "react";

const MyApp: AppType = ({ Component }) => {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        />
        <meta name="theme-color" content="#181818" />
        <meta name="apple-mobile-web-app-status-bar-style" content="#181818" />
        <title>Multi-Agent Simulation</title>
        <meta name="description" content="Multi-Agent Simulation" />
        <meta
          name="keywords"
          content="multi-agent, simulation, AI, technology"
        />
        <meta name="author" content="Your Name" />

        {/* <meta property="og:type" content="website" />
        <meta property="og:title" content="Multi-Agent Simulation" />
        <meta property="og:description" content="Multi-Agent Simulation" />
        <meta property="og:image" content="/path/to/your/image.jpg" />
        <meta property="og:url" content="https://yourwebsite.com" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Multi-Agent Simulation" />
        <meta name="twitter:description" content="Multi-Agent Simulation" />
        <meta name="twitter:image" content="/path/to/your/image.jpg" />
        <meta name="twitter:site" content="@yourtwitterhandle" /> */}

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Component />
    </>
  );
};

export default MyApp;
