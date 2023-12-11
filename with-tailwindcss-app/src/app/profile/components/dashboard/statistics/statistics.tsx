import React from 'react';
import StatisticsChart from '../StatisticsChart/StatisticsChart';
import StatisticsPie from '../StatisticsPie/StatisticsPie';
import styles from "./statistics.module.css";

interface StatisticsProps {}

const Statistics: React.FC<StatisticsProps> = () => {
  return (
    <div className={styles.statistics}>
      <div className={styles.container}>
          <StatisticsChart />
            <StatisticsPie />
      </div>
    </div>
  );
};

export default Statistics;