import React from "react";
import styles from './global.module.css'
import SearchBar from '../components/skins/SearchBar/SearchBar'
import { FaGoogleWallet } from 'react-icons/fa';
import StatusBar from "../components/skins/StatusBar/StatusBar";
import Table from "../components/skins/Table/Table";
// import Paddle from "../components/skins/Paddle/Paddle";
// import Ball from "../components/skins/Ball/Ball";

export default async function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <>
      <div className={styles['skins']}>
        <div className={styles['skins-container']}>
          <SearchBar />
          <div className={styles.wallet}>
              <FaGoogleWallet />
              <span className={styles['wallet-value']}>215</span>
          </div>
          {/* <StatusBar Table={<Table />} Paddle={<Paddle />} Ball={<Ball />} */}
          <StatusBar Table={<Table />} />
        </div>
      </div>
          {children}
      </>
    )
};