"use client";

import React from 'react'
import styles from './Settings.module.css'
import { UilSetting } from '@iconscout/react-unicons';
import LogOut from '../LogOut/LogOut';
import EditProfile from '../EditProfile/EditProfile';

interface SettingsProps {
    isOpen?: boolean;
    onClick?: () => void;
}

const Settings: React.FC<SettingsProps> = ({ isOpen, onClick }) => {
    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        setOpen(!open);
        // if (onClick) {
        //     onClick();
        // }
    };

    return (
        <div
          className={styles.settings}
          onClick={handleClick}
        >
          {open && (
            <div className={styles.OpenedBar}>
                <div className={styles.otherBar}>
                    <EditProfile />
                </div>
                <div className={styles.otherBar}>
                    <LogOut />
                </div>
            </div>
          )}
          {/* <div className={styles['settings-container']}> */}
           <div className={`${styles['openBar-container']} ${open ? 'open' : ''}`}>
            <UilSetting />
            <span className={styles['setting-span']}> Settings</span>
          </div>
          </div>
      );
};

export default Settings;