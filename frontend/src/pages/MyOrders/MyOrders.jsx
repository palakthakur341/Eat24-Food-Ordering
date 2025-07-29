import { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import axios from 'axios';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';

const MyOrders = () => {
  const [data, setData] = useState([]);  // Start as empty array
  const { url, token, currency } = useContext(StoreContext);

  const fetchOrders = async () => {
    try {
      const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
      setData(response.data?.data || []);  // Avoid undefined
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setData([]);  // Default to empty if API fails
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, []);

  return (
    <div className="container">
  {Array.isArray(data) && data.length > 0 ? (
    data.map((order, index) => (
      <div key={index} className='my-orders-order'>
        <img src={assets.parcel_icon} alt="" />
        <p>
          {Array.isArray(order.items)
            ? order.items.map((item, idx) =>
                idx === order.items.length - 1
                  ? `${item.name} x ${item.quantity}`
                  : `${item.name} x ${item.quantity}, `
              )
            : "No items"}
        </p>
        <p>{currency}{order.amount}.00</p>
        <p>Items: {order.items ? order.items.length : 0}</p>
        <p><span>&#x25cf;</span> <b>{order.status}</b></p>
        <button onClick={fetchOrders}>Track Order</button>
      </div>
    ))
  ) : (
    <p>No orders yet.</p>
  )}
</div>
  );
};

export default MyOrders;