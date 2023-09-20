import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { addToCart } from "../slices/cartSlice";
// import { useGetAllProductsQuery } from "../slices/productsApi";

const Home = () => {
  const { items: data, status } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const { data, error, isLoading } = useGetAllProductsQuery();

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    navigate("/cart");
  };

  return (
    <div className="home-container">
      {status === "success" ? (
        <>
          <h2>Nuovi Arrivi</h2>
          <div className="products">
            {data &&
              data?.map((product) => (
                <div key={product._id} className="product">
                  <h3>{product.name}</h3>
                  <img src={product.image?.url} alt={product.name} />
                  <div className="details">
                    <span>{product.desc}</span>
                    <span className="price">€{product.price}</span>
                  </div>
                  <button onClick={() => handleAddToCart(product)}>
                    Aggiungi al carello
                  </button>
                </div>
              ))}
          </div>
        </>
      ) : status === "pending" ? (
        <p>Caricamento...</p>
      ) : (
        <p>Unexpected error occured...</p>
      )}
    </div>
  );
};

export default Home;
