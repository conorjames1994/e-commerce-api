

import React from 'react';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { showOrders } from './utils/utils';
import { NavLink } from 'react-router';
import { logOut } from './utils/utils';

const Orders = () => {

    const token = localStorage.getItem("token");
    const cart_id = localStorage.getItem("cart_id")
    const user_id = localStorage.getItem("user_id")

    const [orders, setOrders] = useState([]);
    const [clicked, setClicked] = useState(0);
    
    const navigate = useNavigate();
     //get users orders api call
    useEffect(() => {
    
        showOrders(user_id, token).then((response) => {
            if(response.status === 200){
                console.log(response)
               setOrders(response.data.message)
            }
            else {
                alert("Something went wrong trying to find your orders, please try again")
            }
        })
     
     
    }, [])
    



  return <div>
     <NavLink to="/">Home</NavLink>
    <h1>Orders</h1>
    {orders.length > 0 ? orders.map((order) => {

        return (
           <div key={order.order_id}>
            <h3>Order id- {order.order_id}</h3>
            <h3>Order date- {order.order_date}</h3>
        <h3>{order.name}</h3>
        <button onClick={() => setClicked(order.order_id)}>Details</button>
        {
            clicked === order.order_id ? (
                    <div>
                    <h4>{order.description}</h4>
                    <h4>Status- {order.status}</h4>
                    <h4>Price- {order.price}</h4>
                    <button onClick={() => setClicked(0)}>Hide details</button>
                    </div> 
                    ) : null
        }
                 
          
        
        <br />
        </div>  

        )
       
        
    }): <h3>No orders currently</h3>}
  </div>;
};

export default Orders;