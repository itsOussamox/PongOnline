import React from 'react';
import StatisticsChart from '../../dashboard/StatisticsChart/StatisticsChart';
import StatisticsPie from '../../dashboard/StatisticsPie/StatisticsPie';
import styles from './Statistics.module.css';

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