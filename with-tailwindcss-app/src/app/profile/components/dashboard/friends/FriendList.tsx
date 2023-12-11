import React from 'react'
import styles from './friends.module.css'
import FriendItem from './FriendItem';

interface Friend {
    id: string;
    name: string;
    picture: string;
  }
  
  interface FriendsProps {
    friends: Friend[];
    onFriendItemClick: (id: string) => void;
  }

const FriendList: React.FC<FriendsProps> = ({ friends , onFriendItemClick}) => {
  return (
    <div className={styles['friends-list']}>
    <ul>
        {friends.map((friend) => (
        <FriendItem
            key={friend.id}
            id={friend.id}
            name={friend.name}
            picture={friend.picture}
            onFriendItemClick={() => onFriendItemClick(friend.id)}
        />
        ))}
    </ul>
  </div>
  )
}

export default FriendList