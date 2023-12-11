import React from 'react';
import styles from './Table.module.css';
import SkinComp from '../SkinComp/SkinComp';
import Skin_purple from './../../../imgs/skin_purple.svg';
import Skin_yellow from './../../../imgs/skin_yellow.svg';
import Skin_green from './../../../imgs/skin_green.svg';
import Skin_black from './../../../imgs/skin_black.svg';

const Table: React.FC = () => {
  return (
    <div className={styles.Table}>
      <SkinComp svgImage={Skin_yellow} skinName="Snouae rfe3 ta7di" WalletValue={215} />
      <SkinComp svgImage={Skin_purple} skinName="Anas senior frontend" WalletValue={215} />
      <SkinComp svgImage={Skin_green} skinName="Youssef NASIK" WalletValue={215} />
      <SkinComp svgImage={Skin_black} skinName="Ayman fih Depression" WalletValue={215} />
    </div>
  );
};

export default Table;