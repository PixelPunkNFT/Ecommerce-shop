import React, { useState, useEffect } from 'react';
import { FaTruckLoading } from 'react-icons/fa';
import axios from 'axios';
import styled from 'styled-components';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import { setHeaders, url } from '../../../slices/api';

const Chart = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);

  // Funzione per confrontare gli oggetti
  function compare(a, b) {
    if (a._id < b._id) {
      return 1;
    }
    if (a._id > b._id) {
      return -1;
    }
    return 0;
  }

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      try {
        const res = await axios.get(`${url}/orders/week-sales`, setHeaders());
        res.data.sort(compare);

        const newData = res.data.map((item) => {
          const DAYS = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"]; 

          return {
            day: DAYS[item._id - 2],
            amount: item.total / 1,
          };
        });

        setSales(newData);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <StyledChart>
      <h3>Guadagno degli ultimi sette giorni</h3>

      {loading ? (
        <Loader>Loading Chart...</Loader>
      ) : (
        <>
          <FaTruckLoading size={40} />
          <ResponsiveContainer width="100%" height={230}>
            <LineChart
              data={sales}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="amount"
                name="Ammontare"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </StyledChart>
  );
};

export default Chart;

const StyledChart = styled.div`
  width: 100%;
  height: 300px;
  margin-top: 2rem;
  padding: 1rem;
  border: 2px solid rgba(48, 51, 78);
  border-radius: 5px;
  background: rgb(48, 51, 78);
    color: rgba(234, 234, 255, 0.87);
  transition: transform 0.3s, opacity 0.3s; /* Aggiunto effetto di transizione */

  &:hover {
    transform: scale(1.05); /* Ingrandisci leggermente al passaggio del mouse */
    opacity: 1; /* Opacità completa al passaggio del mouse */
  }

  h3 {
    margin-bottom: 1rem;
    
  }
`;

const Loader = styled.p`
  margin-top: 2rem;
`;
