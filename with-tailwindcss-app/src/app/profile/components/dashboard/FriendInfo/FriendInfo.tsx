import React, { useEffect } from 'react';
import styles from './FriendInfo.module.css';

interface FriendInfoProps {
  id: string;
  name: string;
  picture: string;
}

const FriendInfo = React.forwardRef<HTMLDivElement, FriendInfoProps>((props, ref) => {
  useEffect(() => {
    console.log("FriendInfo Mounted:", props.id, props.name, props.picture);

    // Clean-up function (optional)
    return () => {
      console.log("FriendInfo Unmounted");
    };
  }, [props.id, props.name, props.picture]);

  return (
  <div ref={ref} className={styles['info-container']}>
    <div className={styles['info-picture']}>
      <img src={props.picture} alt={props.name} className={styles['info-picture']}/>
    </div>
        <span className={styles['info-name']}>{props.name}</span>
    </div>
  );
});

export default FriendInfo;