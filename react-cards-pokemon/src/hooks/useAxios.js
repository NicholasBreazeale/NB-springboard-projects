import { useState } from "react";
import { v4 as uuid } from "uuid";
import axios from "axios";

const useAxios = url => {
  const [baseUrl] = useState(url);
  const [data, setData] = useState([]);
  const addData = async route => {
    const response = await axios.get(`${baseUrl}${typeof(route) === "string" ? route : ""}`);
    setData(data => [...data, { ...response.data, id: uuid() }]);
  };

  return [data, addData];
};

export default useAxios;
