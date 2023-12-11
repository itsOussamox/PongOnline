import React from 'react'
import styles from './Match_History.module.css'

interface MatchXpProps {
    matchXp: number;
}

const MatchXp: React.FC<MatchXpProps> = ({ matchXp }) => {
    return (
        <div className={styles['matchItem-xp']}>
            {/* <span className={styles['matchItem-xp']}>{matchXp}</span> */}
            {matchXp > 0 ? <span className={styles['matchItem-xp-win']}>+{matchXp}</span> : <span className={styles['matchItem-xp-loss']}>{matchXp}</span>}
        </div>
    );
};

export default MatchXp;