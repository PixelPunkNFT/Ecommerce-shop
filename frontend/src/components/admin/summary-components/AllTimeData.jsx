import { useSelector } from "react-redux";
import styled from "styled-components";

const AllTimeData = () => {

    const {items} = useSelector(state => state.products)
    
    console.log(items)

    return <Main>
        <h3>All Time</h3>
        <Info>
            <Title>Users</Title>
            <Data>30</Data>
        </Info>
        <Info>
            <Title> Products </Title>
            <Data>{items.length}</Data>
        </Info>
        <Info>
            <Title> Order </Title>
            <Data>200</Data>
        </Info>
        <Info>
            <Title> Earnings </Title>
            <Data>$20,200</Data>
        </Info>
    </Main>;
}

export default AllTimeData

const Main = styled.div`
    background: rgb(48,51,78);
    color: rgba(234, 234, 255, 0.87);
    margin-top: 1.5rem;
    font-size: 14px;
    padding: 1rem;
    border-radius: 5px;
`;

const Info = styled.div`
    display: flex;
    font-size:  14px;
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
`;

const Title = styled.div`
    flex: 1;
`;
const Data = styled.div`
    flex: 1;
    font-weight: 700;
`;
