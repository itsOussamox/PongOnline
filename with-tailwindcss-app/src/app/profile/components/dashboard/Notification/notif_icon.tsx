import React from "react";
import { IoMdNotifications } from "react-icons/io";
import styles from "./Notification.module.css";

interface NotifIconProps {
  onClick: () => void;
}

const NotifIcon: React.FC<NotifIconProps> = ({ onClick }) => {
  return (
    <div
      className={`${styles.NotifIcon} w-12 h-12 rounded-full bg-aliceblue cursor-pointer`}
    >
      <IoMdNotifications onClick={onClick} />
    </div>
  );
};

export default NotifIcon;