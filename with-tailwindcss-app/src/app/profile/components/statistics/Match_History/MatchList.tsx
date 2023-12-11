import React from 'react'
import styles from './Match_History.module.css'
import { match } from 'assert';
import MatchItem from './MatchItem';

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

const MatchList: React.FC<MatchListProps> = ({ matches }) => {
  return (
    <div className={styles['match-list']}>
      <ul>
        {matches.map((match: Match) => (
          <MatchItem
            key={match.id}
            id={match.id}
            player1_profile={match.player1_profile}
            player2_profile={match.player2_profile}
            player1_score={match.player1_score}
            player2_score={match.player2_score}
            result={match.result}
            xp={match.xp}
          />
        ))}
      </ul>
    </div>
  );
};

export default MatchList;