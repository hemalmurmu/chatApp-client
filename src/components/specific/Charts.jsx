import React from 'react'
import {Line,Doughnut} from "react-chartjs-2"
import {Chart as ChartJS,CategoryScale,Tooltip,LinearScale,PointElement,LineElement,ArcElement,Legend,Filler} from 'chart.js'
import { getLast7days } from '../../lib/features';
import { lightPurple, orange, purple } from '../constants/color';

ChartJS.register(
    CategoryScale,
    Tooltip,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Legend,
    Filler
    );

 const lables = getLast7days();



const LineChartOptions={
    responsive:true,
    plugins:{
        legend:{
            display:false,
        },
        title:{
            display:false,
        }
    },

    scales:{
        x:{
            grid:{
                display:false
            }
        },
        y:{
            beginAtZero:true,
            grid:{
                display:false
            }
        }

    }
}


const LineChart = ({dataArray= []}) => {

    const data={
        labels:lables,
        datasets:[{
            data:dataArray,
            label:"Messages",
            fill:false,
            backgroundColor:lightPurple,
            borderColor:purple,
        },
    ],
    }
  return (
    <Line data={data} options={LineChartOptions}></Line>
  )
}


const doughnutOptions ={
    responsive:true,
    plugins:{
        legend:{
            display:false,
        },
        title:{
            display:false
        },
    },
    cutout:120,
}

const DoughnutChart = ({dataArray=[], labels=[]}) => {
    const data={
        labels,
        datasets:[{
            data:dataArray,
            label:"",
            fill:false,
            hoverBackgroundColor:[purple,orange],
            backgroundColor:[lightPurple,orange],
            borderColor:[purple,orange],
            offset:40
        },
    ],
    }
    return (
      <Doughnut data={data} options={doughnutOptions} style={{zIndex:10}}/>
    )
  }

export {LineChart,DoughnutChart}