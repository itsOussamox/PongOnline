import React from 'react'
import styles from './Global_Rating.module.css'

interface Rating {
    id: string;
    player_profile: string;
    player_name: string;
    player_title: string;
    rating: number;
}

interface RatingListProps {
    ratings: Rating[];
}

const RatingItem: React.FC<Rating> = ({id, player_profile, player_name, player_title, rating}) => {
  return (
    <div className={styles['rating-container']}>
        <div className={styles['player-profile']}>
            <img src={player_profile} alt="Profile" className={styles['rounded-lg']} />
        </div>
            <span className={styles['player-name']}>{player_name}</span>
            <span className={styles['player-title']}>{player_title}</span>
        <span className={styles['player-rating']}>{rating}</span>
    </div>
  )
}

export default RatingItem