// Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { Table, Tooltip } from 'antd';
import bookdata from './book.json';
import { Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const { Text, Title } = Typography;
  const [jsonData, setJsonData] = useState([]);

  useEffect(() => {
    if(!localStorage.getItem("token")){
      navigate("/login-signup")
    }
    setJsonData(bookdata.map((item, index) => ({ ...item, key: index + 1 })));
  }, []);
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (value, row) => (
        <Tooltip placement="bottom" color="#dcc2c2" title={() => (
          <div className='flex flex-col justify-items-start'>
            <Text>Author : {row.author}</Text>
            <Text>Genre : {row.genre}</Text>
            <Text>Publisher : {row.publisher}</Text>
          </div>)} >
          {value}
        </Tooltip >
      ),
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: 'User Name',
      dataIndex: 'userName',
      key: 'userName',
      sorter: (a, b) => a.userName.localeCompare(b.userName),
    },
    {
      title: 'Mobile Number',
      dataIndex: 'mobileNumber',
      key: 'mobileNumber',
      sorter: (a, b) => a.mobileNumber.localeCompare(b.mobileNumber),
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      render: (a) => `${a} ${(a === 1 || a === 0) ? 'Day' : 'Days'}`,
      sorter: (a, b) => b.duration - a.duration,
    },
  ];

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {/* Card 1 */}
        <div className="bg-[#e8dfde] rounded-lg shadow-md p-4">
          <div className="text-5xl font-bold text-center text-gray-800">100</div>
          <div className="text-center text-gray-800 text-2xl">Total Books</div>
        </div>
        {/* Card 2 */}
        <div className="bg-[#e8dfde] rounded-lg shadow-md p-4">
          <div className="text-5xl font-bold text-center text-gray-800">100</div>
          <div className="text-center text-gray-800 text-2xl">Total Readers</div>
        </div>
        {/* Card 3 */}
        <div className="bg-[#e8dfde] rounded-lg shadow-md p-4">
          <div className="text-5xl font-bold text-center text-gray-800">75</div>
          <div className="text-center text-gray-800 text-2xl">Total Issued</div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto sm:overflow-hidden">
        <Table
          columns={columns}
          dataSource={jsonData}
          pagination={{ pageSize: 10 }}
          scroll={{ x: window.innerWidth < 900 ? 1000 : undefined }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
