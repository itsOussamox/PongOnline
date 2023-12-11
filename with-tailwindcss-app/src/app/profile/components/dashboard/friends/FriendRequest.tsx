import React from 'react';
import styles from './friends.module.css';
import FriendRequestItem from './FriendRequestItem';

interface FriendRequest {
  id: string;
  name: string;
  picture: string;
}

interface FriendRequestProps {
  friendRequests: FriendRequest[];
}

const FriendRequest: React.FC<FriendRequestProps> = ({ friendRequests }) => {
  return (
    <div className={styles['friendRequest']}>
      <ul>
        {friendRequests.map((friendRequest) => (
          <FriendRequestItem
            key={friendRequest.id}
            id={friendRequest.id}
            name={friendRequest.name}
            picture={friendRequest.picture}
          />
        ))}
      </ul>
    </div>
  );
}

export default FriendRequest;