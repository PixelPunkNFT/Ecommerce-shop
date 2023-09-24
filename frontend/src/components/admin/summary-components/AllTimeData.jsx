import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { fetchTotalUsers } from "../../../slices/totalUsersSlice";
import { fetchTotalOrders } from "../../../slices/ordersSlice"; // Assicurati che il percorso sia corretto
import { fetchTotalEarnings } from "../../../slices/ordersSlice"; // Assicurati che il percorso sia corretto

const AllTimeData = () => {
  const items = useSelector((state) => state.products.items);
  const totalUsers = useSelector((state) => state.totalUsers.totalUsers); // Usa il nome corretto dello slice
  const totalOrders = useSelector((state) => state.orders.totalOrders);
  const totalEarnings = useSelector((state) => state.orders.totalEarnings);


  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTotalUsers());
    dispatch(fetchTotalOrders());
    dispatch(fetchTotalEarnings());
  }, [dispatch]);

  return (
    <Main>
      <h3>Tutto il tempo</h3>
      <Info>
        <Title>Utenti</Title>
        <Data>{totalUsers}</Data>
      </Info>
      <Info>
        <Title>Prodotti</Title>
        <Data>{items.length}</Data>
      </Info>
      <Info>
        <Title>Ordini</Title>
        <Data>{totalOrders }</Data>

      </Info>
      <Info>
        <Title>Guadagni</Title>
        <Data>€ {totalEarnings}</Data>
      </Info>
    </Main>
  );
};

export default AllTimeData;

const Main = styled.div`
  background: rgb(48, 51, 78);
  color: rgba(234, 234, 255, 0.87);
  margin-top: 1.5rem;
  font-size: 14px;
  padding: 1rem;
  border-radius: 5px;
  &:hover {
    transform: scale(1.10);
    opacity: 1;
  }
`;

const Info = styled.div`
  display: flex;
  font-size: 14px;
  margin-top: 1rem;
  padding: 0.5rem;
  border-radius: 3px;
  background: rgba(38, 198, 249, 0.12);

  p {
    flex: 1;
  }
  &:nth-child(even) {
    background: rgba(102, 108, 255, 0.12);
  }
  &:hover {
    transform: scale(1.30);
    opacity: 1;
  }
`;

const Title = styled.div`
  flex: 1;
`;
const Data = styled.div`
  flex: 1;
  font-weight: 700;
`;
