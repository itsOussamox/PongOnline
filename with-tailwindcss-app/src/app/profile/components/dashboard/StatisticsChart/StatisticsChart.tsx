"use client";

import React from 'react';
import * as echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';
import styles from './StatisticsChart.module.css';

interface StatisticsChartProps {}

const StatisticsChart: React.FC<StatisticsChartProps> = () => {
  const option = {
    color: ['var(--blue 500)'],

    toolbox: {
        feature: {
            saveAsImage: {},
        }
    },

    tooltip: {
        trigger: "axis",
        axisPointer: {
            type: "cross"
        },
        backgroundColor: "rgba(0, 0, 0, 0.59)",
        borderWidth: 0,
    },
    grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
        show: false,
    },

    xAxis: [
        {
            type: "category",
            boundaryGap: false,
            data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        }
    ],
    yAxis: [
        {
            type: "value",
            splitLine: {
                show: false,
            }
        }
    ],
    series: [
        {
            type: "line",
            smooth: true,
            lineStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                        offset: 0,
                        color: 'rgba(154, 155, 211, 0)',
                    },
                    {
                        offset: 1,
                        color: '#9A9BD3'
                    }
                ]),
                width: 4
            },
            areaStyle: {
                opacity: .5,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 0.8, [
                    {
                        offset: 0,
                        color:'#9A9BD3'
                    },
                    {
                        offset: 1,
                        color: 'rgba(154, 155, 211, 0)'
                    }
                ])
            },
            emphasis: {
                focus: "series",
            },
            showSymbol: false,
            data: [28000, 19000, 32000, 18000, 41000, 30000, 26000]
        }
    ]
  };

  return <ReactEcharts className={styles['echart-for-react']} option={option} />;
};

export default StatisticsChart;