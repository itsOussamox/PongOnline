// import React from "react";
// import "./Skins.module.css";

// const Skins: React.FC = () => {
//   return (
//     <div className="Skins">
//       <div className="skins-container">
//         <span className="skins-title">Skins</span>
//         <div className="Skins-rectangle">
//           <div className="Skins-circle"></div>
//         </div>
//         <div className="Skins-stick"></div>
//       </div>
//     </div>
//   );
// };

// Skins.tsx
import React from 'react';
import styles from "./skins.module.css"; // Update the import if needed

const Skins: React.FC = () => {
  return (
    <div className={styles.Skins}>
      <div className={styles['skins-container']}>
        <span className={styles['skins-title']}>Skins</span>
        <div className={styles['Skins-rectangle']}>
          <div className={styles['Skins-circle']}></div>
        </div>
        <div className={styles['Skins-stick']}></div>
      </div>
    </div>
  );
};

export default Skins;