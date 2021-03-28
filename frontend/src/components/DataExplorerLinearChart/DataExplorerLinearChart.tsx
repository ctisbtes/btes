import React from 'react';
import LoaderMask from '../LoaderMask/LoaderMask';
import { Line } from 'react-chartjs-2';
import './DataExplorerLineChart.scss';

interface DataExplorerLinearChartProps {
  xAxisData: Array<string>;
  yAxisData: Array<string>;
  label: string;
  isFetching: boolean | undefined;
}

const DataExplorerLinearChart: React.FC<DataExplorerLinearChartProps> = (
  props
) => {
  const { xAxisData, yAxisData, label, isFetching } = props;

  const data = {
    labels: xAxisData,
    datasets: [
      {
        label: label,
        lineTension: 0.1,
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: '#1a237e',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 0,
        pointHitRadius: 10,
        data: yAxisData,
      },
    ],
  };

  const options = {
    legend: {
      display: false,
    },
    responsive: true,
    datasetStrokeWidth: 3,
    pointDotStrokeWidth: 4,
    scaleLabel: "<%= Number(value).toFixed(0).replace('.', ',') + '°C'%>",
  };
  return (
    <div>
      {isFetching ? (
        <LoaderMask></LoaderMask>
      ) : (
        <div className="m-4">
          <div className="comp-data-explorer-line-chart-header ml-5">
            {label}
          </div>
          <Line height={100} data={data} options={options} />
        </div>
      )}
    </div>
  );
};

export default DataExplorerLinearChart;
