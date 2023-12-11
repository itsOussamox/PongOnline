import React from 'react';import type { Metadata } from 'next'
import { useState, useEffect } from 'react'
import { Inter } from 'next/font/google'
import styles from './global.module.css';
import Statistics from '../components/statistics/Statistics/Statistics'
import Match_History from '../components/statistics/Match_History/Match_History';
import aoumad from '../imgs/aoumad.jpeg'
import yamon from '../imgs/ael-yamo.jpeg'
import snouae from '../imgs/snouae.jpeg'
import Global_Rating from '../components/statistics/Global_Rating/Global_Rating';

export default async function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {

    const matches_history = [
      { id: "1", player1_profile: aoumad.src, player2_profile: yamon.src, player1_score: 1, player2_score: 2, result: "Lose", xp: -35 },
      { id: "2", player1_profile: aoumad.src, player2_profile: yamon.src, player1_score: 2, player2_score: 1, result: "Win", xp: 25 },
      { id: "3", player1_profile: aoumad.src, player2_profile: yamon.src, player1_score: 1, player2_score: 2, result: "Lose", xp: -35 },
      { id: "4", player1_profile: aoumad.src, player2_profile: yamon.src, player1_score: 2, player2_score: 1, result: "Win", xp: 25 },
      { id: "5", player1_profile: aoumad.src, player2_profile: yamon.src, player1_score: 1, player2_score: 2, result: "Lose", xp: -35 },
      { id: "6", player1_profile: aoumad.src, player2_profile: yamon.src, player1_score: 2, player2_score: 1, result: "Win", xp: 25 },
      { id: "7", player1_profile: aoumad.src, player2_profile: yamon.src, player1_score: 1, player2_score: 2, result: "Lose", xp: -35 },
      { id: "8", player1_profile: aoumad.src, player2_profile: yamon.src, player1_score: 2, player2_score: 1, result: "Win", xp: 25 },
    ];

    const global_rating = [
      { id: "1", player_profile: aoumad.src, player_name: "Abderazzak ", player_title: "aoumad", player_rating: 3651 },
      { id: "2", player_profile: yamon.src, player_name: "Mr.Depression", player_title: "ael-yamo", player_rating: 3600 },
      { id: "3", player_profile: aoumad.src, player_name: "Abderazzak", player_title: "aoumad", player_rating: 2451 },
      { id: "4", player_profile: snouae.src, player_name: "Rafi3_ta7adi ", player_title: "snoua", player_rating: 2151 },
      { id: "5", player_profile: aoumad.src, player_name: "Abderazzak", player_title: "aoumad", player_rating: 1651 },
      { id: "6", player_profile: yamon.src, player_name: "Mr.Depression", player_title: "ael-yamo", player_rating: 1051 },
      { id: "7", player_profile: aoumad.src, player_name: "Abderazzak", player_title: "aoumad", player_rating: 751 },
      { id: "8", player_profile: yamon.src, player_name: "Mr.Depression", player_title: "ael-yamo", player_rating: 81 },
      { id: "1", player_profile: aoumad.src, player_name: "Abderazzak ", player_title: "aoumad", player_rating: 3651 },
      { id: "2", player_profile: yamon.src, player_name: "Mr.Depression", player_title: "ael-yamo", player_rating: 3600 },
      { id: "3", player_profile: aoumad.src, player_name: "Abderazzak", player_title: "aoumad", player_rating: 2451 },
      { id: "4", player_profile: snouae.src, player_name: "Rafi3_ta7adi ", player_title: "snoua", player_rating: 2151 },
      { id: "5", player_profile: aoumad.src, player_name: "Abderazzak", player_title: "aoumad", player_rating: 1651 },
      { id: "6", player_profile: yamon.src, player_name: "Mr.Depression", player_title: "ael-yamo", player_rating: 1051 },
      { id: "7", player_profile: aoumad.src, player_name: "Abderazzak", player_title: "aoumad", player_rating: 751 },
      { id: "8", player_profile: yamon.src, player_name: "Mr.Depression", player_title: "ael-yamo", player_rating: 81 },
    ];

    return (
      <>
            <div className={styles['statistics']}>
              {/* <div className={`${styles['statistics']} ${styles['left-panel']}`}> */}
              <div className={styles['left-panel']}>
                <Statistics />
                <Match_History matches={matches_history}/>
              </div>
              <div className={styles['right-panel']}>
                <Global_Rating ratings={global_rating}/>
              </div>
            </div>
        {children}
        </>
    )
};