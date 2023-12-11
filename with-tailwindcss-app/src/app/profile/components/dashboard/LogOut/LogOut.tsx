import React from 'react'
import styles from './LogOut.module.css'
import { IoIosLogOut } from "react-icons/io";

const LogOut: React.FC = () => {
  return (
    <div className={styles.LogOut}>
        <IoIosLogOut />
        <div className='logout-text'>Log Out</div> {
        }

    </div>
  );
};

export default LogOut