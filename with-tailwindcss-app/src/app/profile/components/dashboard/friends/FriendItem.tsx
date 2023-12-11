import React from 'react';
import styles from './friends.module.css';
import MoreIcon from './more_icon';

interface FriendItemProps {
  id: string; // Corrected prop type to string
  name: string;
  picture: string;
  onFriendItemClick: (id: string) => void; // Corrected callback function parameter type
}

const FriendItem: React.FC<FriendItemProps> = (props) => {
  return (
    <div className={styles['friendItem-container']}
      onClick={() => props.onFriendItemClick(props.id)} // Corrected callback function invocation
    >
      <div className={styles['friend-image']}>
        <img src={props.picture} alt="Profile" className="rounded-full" />
      </div>
      <div className={styles['friend-name']}>
        <span className={styles['friend-name']}>{props.name}</span>
      </div>
      <MoreIcon />
    </div>
  );
};

export default FriendItem;