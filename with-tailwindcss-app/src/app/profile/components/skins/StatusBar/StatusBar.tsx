"use client";

import  React, { useState } from "react";
import { ReactNode } from "react";
import styles from './StatusBar.module.css'
import Table from '../Table/Table'
import Link from 'next/link'

interface StatusBarProps {
    Table: ReactNode;
    // Paddle: ReactNode;
    // Ball: ReactNode;
}

const StatusBar = (props: StatusBarProps) => {
    const [table, setTable] = useState<boolean>(true);
    const [paddle, setPaddle] = useState<boolean>(false);
    const [ball, setBall] = useState<boolean>(false);

    return (
        <div className={styles.StatusBar}>
            <ul className={styles['ul-style']}>
                <li aria-label="table" onClick={() => {
                    setTable(true);
                    setPaddle(false);
                    setBall(false);
                }} className={styles.navli}>
                    <Link href="#" className={styles['nav-a']}>Table</Link>
                </li>
                <li aria-label="paddle" onClick={() => {
                    setTable(false);
                    setPaddle(true);
                    setBall(false);
                }} className={styles.navli}>
                    <a href="#" className={styles['nav-a']}>Paddle</a>
                </li>
                <li aria-label="ball" onClick={() => {
                    setTable(false);
                    setPaddle(false);
                    setBall(true);
                }} className={styles.navli}>
                    <a href="#" className={styles['nav-a']}>Ball</a>
                </li>
            </ul>
            <div className={styles.content}>
                {table && props.Table} {/* Render Table content if 'table' state is true */}
                {/* {paddle && props.Paddle} Render Paddle content if 'paddle' state is true */}
                {/* {ball && props.Ball} Render Ball content if 'ball' state is true */}
            </div>
        </div>
    );
};

export default StatusBar;


{/* <ul className={styles['sidebar']}>
<li onClick={() => setTable(true)} className={styles.navli}>
<a href="#" className={styles['nav-a']}>Table</a>
</li>
<li onClick={() => setPaddle(true)} className={styles.navli}>
<a href="#" className={styles['nav-a']}>Paddle</a>
</li>
<li onClick={() => setBall(true)} className={styles.navli}>
<a href="#" className={styles['nav-a']}>Ball</a>
</li>
</ul> */}