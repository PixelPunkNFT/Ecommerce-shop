import { useState, useEffect } from "react";
import styled from "styled-components";
import { FaUsers, FaChartBar, FaClipboard } from "react-icons/fa";
import Widget from "../admin/summary-components/Widget";
import axios from "axios";
import { setHeaders, url } from "../../slices/api";
import Chart from "../admin/summary-components/Chart"
import Transactions from "./summary-components/Transactions";
import AllTimeData from "./summary-components/AllTimeData";

const Summary = () => {

  const [users, setUsers] = useState([])
  const [usersPerc, setUsersPerc] = useState(0)

  const [orders, setOrders] = useState([])
  const [ordersPerc, setOrdersPerc] = useState(0)
  
  const [income, setIncome] = useState([])
  const [incomePerc, setIncomePerc] = useState(0)

  
  
  function compare (a, b) {
    if (a._id < b._id) {
      return 1;
    }
    if (a._id > b._id) {
      return -1;
    }
    return 0;
  }
//Fetch Users stats
  useEffect(() =>{
    async function fetchData(){
      try {
        const res = await axios.get(`${url}/users/stats`, setHeaders())
        res.data.sort(compare)
        setUsers(res.data);
        setUsersPerc(((res.data[0].total - res.data[1].total) / res.data[1].total) * 100 );
      } catch (err) {
        console.log(err)
      }
    }

    fetchData()
  }, [])

  //Fetch Orders stats

  useEffect(() =>{
    async function fetchData(){
      try {
        const res = await axios.get(`${url}/orders/stats`, setHeaders())
        res.data.sort(compare)
        setOrders(res.data);
        setOrdersPerc(((res.data[0].total - res.data[1].total) / res.data[1].total) * 100 );
      } catch (err) {
        console.log(err)
      }
    }

    fetchData()
  }, [])
  
  
  //Fetch Income Stats
  
  useEffect(() =>{
    async function fetchData(){
      try {
        const res = await axios.get(`${url}/orders/week-sales`, setHeaders())
        res.data.sort(compare)
        setIncome(res.data);
        setIncomePerc(((res.data[0].total - res.data[1].total) / res.data[1].total) * 100 );
      } catch (err) {
        console.log(err)
      }
    }

    fetchData()
  }, [])




  const data = [
    {
      icon: <FaUsers />,
      digits: users[0]?.total,
      isMoney: false,
      title: "Utenti",
      color: "rgba(123, 234, 255, 0.68)",
      bgColor: "rgba(234, 234, 255, 0.68, 0.12)",
      percentage: usersPerc,
    },
    {
      icon: <FaClipboard />,
      digits: orders[0]?.total,
      isMoney: false,
      title: "Ordini",
      color: "rgba(38, 234, 255, 0.68)",
      bgColor: "rgba(35, 234, 255, 0.68, 0.12)",
      percentage: ordersPerc,
    },
    {
      icon: <FaChartBar />,
      digits: income[0]?.total?.toLocaleString("it-IT", {
        style: "currency",
        currency: "EUR",
      }),
      isMoney: false,
      title: "Stima settimanale",
      color: "rgba(123, 234, 255, 0.68)",
      bgColor: "rgba(132, 234, 255, 0.68, 0.12)",
      percentage: incomePerc,
    }
    ,
  ];

  return (
    <StyledSummary>
      <MainStats>
        <Overview>
          <Title>
            <h2>Panoramica</h2>
            <p>Come stanno andando gli acquisti rispetto alla settimana precedente</p>
          </Title>
          <WidgetWrapper>
            {data?.map((data, index) => (
              <Widget key={index} data={data} />
            ))}
          </WidgetWrapper>
        </Overview>
        <Chart/>
        
      </MainStats>
      <SideStats>
      <AllTimeData />
        <Transactions />
      </SideStats>
    </StyledSummary>
  );
};

export default Summary;

const StyledSummary = styled.div`
  width: 100%;
  display: flex;
`;

const MainStats = styled.div`
  flex: 2;
  width: 100%;
`;

const Title = styled.div`
  p {
    font-size: 14px;
    color: rgba(234, 234, 255, 0.68);
  }
`;

const Overview = styled.div`
  background: rgba(48, 51, 78);
  color: rgba(234, 234, 255, 0.87);
  width: 100%;
  padding: 1.5rem;
  height: 170px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const WidgetWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const SideStats = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 2rem;
  width: 100%;
`;
