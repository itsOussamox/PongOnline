"use client";

import React, { useRef, useState, useEffect } from 'react';
import styles from './Match_History.module.css'
import MatchList from './MatchList';

interface Match {
    id: string;
    player1_profile: string;
    player2_profile: string;
    player1_score: number;
    player2_score: number;
    result: string;
    xp: number;
}

interface MatchProps {
    matches: Match[];
}

const Match_History: React.FC<MatchProps> = ({matches}) => {
  return (
    <div className={styles['matches']}>
        <div className={styles['match-title']}>
            <span >Match History</span>
        </div>
        <div className={styles['match-list']}>
            <MatchList matches={matches}/>
        </div>
    </div>
  )
}

export default Match_History