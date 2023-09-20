import styled from "styled-components";

const Widget = ({ data }) => {
  return (
    <StyleWidget>
      <Icon color={data.color} bgColor={data.bgColor}>
        {data.icon}
      </Icon>
      <Text>
        <h3>
          {data.isMoney 
            ? "$" + data.digits?.toLocaleString() 
            : data.digits?.toLocaleString()
          }
        </h3>
        <p>{data.title}</p>
      </Text>
      {data.percentage < 0 ? <>
      <Percentage isPositive = {false}>
        {Math.floor(data.percentage) + "%"}
      </Percentage>
       </> : <><Percentage isPositive = {true}>
        {Math.floor(data.percentage) + "%"}
      </Percentage></>}
    </StyleWidget>
  );
};

export default Widget;

const StyleWidget = styled.div`
  display: flex;
  align-items: center;
  color: white;
`;

const Icon = styled.div`
  margin-right: 0.5rem;
  padding: 0.5rem;
  color: ${({ color }) => color};
  background: ${({ bgColor }) => bgColor};
  border-radius: 3px;
  font-size: 30px;
`;

const Text = styled.div`
  h3 {
    font-weight: 900;
  }

  p {
    font-size: 16px;
  }
`;
const Percentage = styled.div`
  margin-left: 0.5rem;
  font-size: 18px;
  color: ${({ isPositive }) => 
  isPositive ? "rgb(144, 225, 40)" : "rgb(255, 77, 73)"};
`;
