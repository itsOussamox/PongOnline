import React from 'react'
import styles from './EditProfile.module.css'
import { RiEditBoxLine } from "react-icons/ri";

const EditProfile = () => {
  return (
    <div className={styles.EditProfile}>
        <RiEditBoxLine />
        <div className='edit-profile-text'>Edit Profile</div> {
        }
    </div>
  )
}

export default EditProfile