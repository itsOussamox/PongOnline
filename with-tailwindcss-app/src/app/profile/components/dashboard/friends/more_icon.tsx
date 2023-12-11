import React from 'react';
import { IoMdMore } from 'react-icons/io';
import styles from './friends.module.css';

interface MoreIconProps {
  onClick: () => void;
}

const MoreIcon: React.FC<MoreIconProps> = ({ onClick }) => {
  return (
    <div className={`${styles.MoreIcon} w-12 h-12 rounded-full bg-aliceblue cursor-pointer`}>
      <IoMdMore onClick={onClick}/>
    </div>
  );
};

export default MoreIcon;