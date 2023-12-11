// Sidebar.tsx
import React from 'react';
import styles from './sidebar.module.css'; // Update the import if needed
declare module '@iconscout/react-unicons';
import picture from '../../../imgs/aoumad.jpeg';
import { UilSetting } from '@iconscout/react-unicons';
import { FaGoogleWallet } from 'react-icons/fa';
import Settings from '../Settings/Settings';

interface SidebarInfo {
  id: string;
  username: string;
  profilePic: string;
  title: string;
  wallet: number;
  online: boolean;
}

interface SidebarProps {
  sidebar: SidebarInfo;
  // onSidebarItemClick: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = (props) => {
  return (
        <div className={styles.Sidebar}>
        <div className={styles['sidebar-container']}>
          <div className={styles['profile-header']}>
          <div className={styles['profile-image']}>
            <img src={props.sidebar.profilePic} alt="Profile" className={styles['profile-image']} />
            <span className={styles.username}>{props.sidebar.username}</span>
            <span className={styles['user-id']}>{props.sidebar.title}</span>
          </div>
        </div>
        <div className={styles.wallet}>
              <FaGoogleWallet />
              <span className={styles['wallet-value']}>{props.sidebar.wallet}</span>
        </div>
            <div className={styles['settings-container']}>
            <Settings />
            </div>
      </div>
    </div>
  );
};

export default Sidebar;
