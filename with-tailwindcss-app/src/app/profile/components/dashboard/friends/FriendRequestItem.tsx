import React from 'react'
import styles from './friends.module.css'
import { FcOk } from "react-icons/fc";
import { FcCancel } from "react-icons/fc";

interface FriendRequestItemProps  {
    name: string;
    picture: string;
    id: string;
}


const FriendRequestItem: React.FC<FriendRequestItemProps> = (props) => {
  return (
    <div className={styles['friendReqItem']}>
        <div className={styles['friendReq-image']}>
            <img src={props.picture} alt="Profile" className="rounded-lg" />
        </div>
        <div className={styles['friendReq-name']}>
            <span className={styles['friendReq-name']}>{props.name}</span>
        </div>
        <div className={styles['friendReqSent']}>
                <span className={styles['friendReqSent']}>{props.name} sent you a friend request</span>
                <button className={styles['friendReqAccept']}><FcOk /></button>
                <button className={styles['friendReqDecline']}><FcCancel /></button>
        </div>
    </div>
  );
};

export default FriendRequestItem;