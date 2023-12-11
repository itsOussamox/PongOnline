"use client";

import React, { useRef, useState, useEffect } from 'react';
import FriendItem from './FriendItem';
import Notification from '../Notification/Notification';
import styles from './friends.module.css';
import FriendList from './FriendList';
import FriendRequests from './FriendRequest';
import FriendInfo from '../FriendInfo/FriendInfo';


interface Friend {
  id: string;
  name: string;
  picture: string;
}

interface FriendRequest {
  id: string;
  name: string;
  picture: string;
}

interface FriendsProps {
  friends: Friend[];
  friendsReq: FriendRequest[];
  onFriendItemClick: (id: string) => void;
}

const Friends: React.FC<FriendsProps> = ({ friends, friendsReq}) => {
  const [showRequest, setRequest] = React.useState(false);
  const [selectedFriend, setSelectedFriend] = React.useState<Friend | null>(null);
  const [showInfo, setShowInfo] = React.useState(false);
  const infoRef = useRef<HTMLDivElement>(null);
  const [Blur, setBlur] = useState({} as any);

  const handleFriendItemClick = (friendId: string) => {
    const selectedFriend = friends.find((friend) => friend.id === friendId) || null;
    setSelectedFriend(selectedFriend);
    setShowInfo(true);
  };

  const handleRequestClick = () => {
    // Toggle the visibility of the Friends component
    setRequest((prevShowRequest) => !prevShowRequest);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (infoRef.current && !infoRef.current.contains(event.target as Node))
    {
      // Click outside the FriendInfo component, hide it
      setShowInfo(false);
    }
  };

  useEffect(() => {
    if (showInfo)
    {
      // make the activeBlur true
      setBlur({filter: 'blur(10px)'});
    }
    else
    {
      // make the activeBlur false
      setBlur({});
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, []);

  return (
    <>
    <div className={styles.friends} style={Blur}>
      <div className={styles['friends-container']}>
        <span className={styles['friends-title']}>Friends</span>
        <Notification onRequestClick={handleRequestClick} />
        {showRequest ? (
          <FriendRequests friendRequests={friendsReq} />
          ) : (
            <FriendList 
            friends={friends} 
            onFriendItemClick={handleFriendItemClick}
            />
            )}
      </div>
    </div>
    {showInfo && selectedFriend && (
        <FriendInfo
          id={selectedFriend.id}
          name={selectedFriend.name}
          picture={selectedFriend.picture}
          ref={infoRef}
        />)}
      </>
  );
};

export default Friends;