import React, { useState } from 'react'
import styles from './Match_History.module.css'
import MatchXp from './MatchXp';

interface Match {
    id: string;
    player1_profile: string;
    player2_profile: string;
    player1_score: number;
    player2_score: number;
    result: string;
    xp: number;
}

interface MatchListProps {
    matches: Match[];
}

const MatchItem: React.FC<Match> = (props) => {
    
  return (
    <div className={styles['matchItem-container']}>
        <div className={styles['matchItem-player1']}>
            <img src={props.player1_profile} alt="Profile" className="rounded-lg" />
        </div>
        <span className={styles['matchItem-vs']}>vs</span>
        <div className={styles['matchItem-player2']}>
            <img src={props.player2_profile} alt="Profile" className="rounded-lg" />
        </div>
        <div className={styles['matchItem-result']}>
            {/* {props.result === 'win' ? <span className={styles['matchItem-result-win']}>Win</span> : <span className={styles['matchItem-result-loss']}>Loss</span>} */}
            <span className={styles['matchItem-result']}>{props.result}</span>
        </div>
        <div className={styles['matchItem-scores']}>
            <span className={styles['matchItem-scores']}>{props.player1_score}</span>
            <span className={styles['matchItem-scores']}>-</span>
            <span className={styles['matchItem-scores']}>{props.player2_score}</span>
        </div>
        <div className={styles['matchItem-xp']}>
            <MatchXp matchXp={props.xp} />
        </div>
    </div>
  )
};

export default MatchItem;