import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import './DataExplorerBlockList.scss';
import LoaderMask from '../LoaderMask/LoaderMask';
import { Line } from 'react-chartjs-2';

interface FormatBytesParams {
  bytes: any;
  decimals?: number;
}

const DataExplorerBlockList: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const formatDate = () => {
    const dateObj = new Date();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const year = dateObj.getFullYear();
    const output = year + month + day;
    return output;
  };

  const formatBytes = ({ bytes, decimals = 2 }: FormatBytesParams) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsFetching(true);
        fetch(`https://chain.api.btc.com/v3/block/date/${formatDate()}`)
          .then((response) => response.json())
          .then((data) => {
            setData(data.data);
            console.log(data.data);
          });
        setIsFetching(false);
      } catch (e) {
        console.log(e);
        setIsFetching(false);
      }
    };
    fetchData();
  }, []);
  return (
    <div>
      {isFetching ? (
        <LoaderMask></LoaderMask>
      ) : (
        <div>
          <Table
            borderless
            striped
            hover
            size="sm"
            className="comp-data-explorer-block-list-table"
          >
            <thead>
              <tr className="comp-data-explorer-block-list-table-header-row">
                <th>Height</th>
                <th>Size</th>
                <th>Transaction Count</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {data?.slice(0, 10).map((d) => (
                <tr>
                  <td>{d.height}</td>
                  <td>{formatBytes({ bytes: d.size, decimals: 2 })}</td>
                  <td>{d.tx_count}</td>
                  <td>{d.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default DataExplorerBlockList;
