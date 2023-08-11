import React from 'react';
import { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react'
import axios from 'axios';
import './App.css';
import LinePlot from './components/Graph';
function App() {
  const [count, setCount] = useState(0);
  const chartData = {
    svgNode: null,
    scales: null
  };
  const [data, setData] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    console.log(77, inputValue)
    let param1 = inputValue;
    if (e.keyCode === 13) {
      const apiUrl = 'http://localhost:3000/search?param1=' + inputValue;
      axios.get(apiUrl)
        .then(response => {
          // 请求成功，将数据保存到state中
          console.log(response, 2222)
          setData(response.data);
        })
        .catch(error => {
          // 请求失败，处理错误
          console.error('Error fetching data:', error);
        });
    }

  };
  const handleInputChange = (event:ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
   
  };
  useEffect(() => {
    // 定义后端API的URL
    const apiUrl = 'http://localhost:3000/search';
    const fetchData = async () => {
      try {
        const response = await axios.get(apiUrl);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    
  },[]);
  return (
    <>
    <div className="graph-input" >
      {/* {icon && <div className="icon-wrapper"><Icon icon={icon} title={`title-${icon}`} /></div>} */}
      <input
        className="graph-input-inner"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
    </div>
    {data && (
      <LinePlot data={data} />
    )}


  </>
  );
}

export default App;
