import React from 'react';
import styles from './SkinComp.module.css';

interface SkinProps {
  svgImage: any;
  skinName: string;
  WalletValue: number;
}

const SkinComp: React.FC<SkinProps> = ({ svgImage, skinName, WalletValue }) => {
  return (
    <div className={styles.SkinComp}>
        <img src={svgImage.src} alt={skinName} />
        <span className={styles['skin-name']}>{skinName}</span>
        <span className={styles['wallet-value']}>{WalletValue}</span>
    </div>
  );
};

export default SkinComp;