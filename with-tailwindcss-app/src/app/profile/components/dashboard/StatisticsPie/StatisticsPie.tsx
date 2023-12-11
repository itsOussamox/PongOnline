"use client"

import React from 'react';
import * as echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';
import styles from './StatisticsPie.module.css';

interface StatisticsPieProps {}

const StatisticsPie: React.FC<StatisticsPieProps> = () => {
    const option = {
        color: ['var(--blue 500)'],
        toolbox: {
            feature: {
                saveAsImage: {},
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 10,
            data: ['Failure', 'Success']
        },
        series: [
            {
                name: 'Status',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                showSymbol: false,
                data: [
                    {value: 80, name: 'Success', itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: 'rgba(154, 155, 211, 0)',
                        },
                        {
                            offset: 1,
                            color: '#9A9BD3'
                        }
                    ]), }},
                    {value: 20, name: 'Failure', itemStyle: { color: 'black' }}
                ]
            }
        ]
    };
    return <ReactEcharts className={styles['statistics-pie']} option={option} />;
};

export default StatisticsPie;