import React from 'react'
import styles from './Global_Rating.module.css'
import RatingItem from './RatingItem';
// import { rating } from 'assert';

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

const Global_RatingList: React.FC<RatingListProps> = ({ ratings }) => {
  return (
    <div className={styles['RatingList']}>
        <ul>
            {ratings.map((rating: Rating) => (
            <RatingItem
                key={rating.id}
                id={rating.id}
                player_profile={rating.player_profile}
                player_name={rating.player_name}
                player_title={rating.player_title}
                rating={rating.rating}
            />
            ))}
        </ul>
    </div>
  )
}

export default Global_RatingList;