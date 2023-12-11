import React from 'react'
import styles from './achievement.module.css'
import achievementImage from './../../../imgs/achievement_1.svg'

const achievement: React.FC = () => {
  return ( 
    <div className={styles.achievement}>
        <div className={styles['achievement-container']}>
            <span className={styles['achievement-title']}>Achievements</span>
                <div className={styles['achievement-image']}>
                    <img src={achievementImage.src} alt="Achievement" className={styles['achievement-image_1']} />
                    <img src={achievementImage.src} alt="Achievement" className={styles['achievement-image_2']}/>
                    <img src={achievementImage.src} alt="Achievement" className={styles['achievement-image_3']} />
                </div>
        </div>
    </div>
  )
}

export default achievement