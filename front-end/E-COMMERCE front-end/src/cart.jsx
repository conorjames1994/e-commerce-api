import React from 'react'
import { Outlet } from 'react-router'
import { Navigate } from 'react-router'
import { useEffect, useState } from 'react'
import { getCart } from './utils/utils'
import { useNavigate } from 'react-router'
import { NavLink } from 'react-router'
import { deleteCart } from './utils/utils'
import { deleteSingleItemFromCart } from './utils/utils'
import { Buffer } from 'buffer'
import { createNewDynamicPaymentLink } from './utils/utils'
import { createNewProductOrders } from './utils/utils'


const Cart = () => {
 const navigate = useNavigate();


  const [cartItems, setCartItems] = useState([])
  const [cart_id, setCart_id] = useState(0);
  const [token, setToken] = useState("");
  const [user_id, setUser_id] = useState(0);
 const [totalPrice, setTotalPrice] = useState(0)
 const [link, setLink] = useState("");
  
  let navId = "";

  useEffect(() => {
    const tokenFirst = localStorage.getItem("token");
    const user_idFirst = localStorage.getItem("user_id")
    
    
    if(tokenFirst){
         getCart(user_idFirst, tokenFirst).then((response)=> {
          console.log(response)
         setCartItems(response.data.message);
         
         if(response.data.message[0]){
         setCart_id(response.data.message[0].cart_id); 
         setUser_id(user_idFirst)
         setToken(tokenFirst)
         } 
        
          setToken(tokenFirst);
         
         
       })
    }

  }, [])

//total calculator
        
useEffect(() => {
  const prices = cartItems.map(item => item.price);
const price = prices.reduce((acc, currentVal) => acc + currentVal, 0)
setTotalPrice(price)
}, [cartItems])


  const clearProductsAndCart = () => {
    console.log(cart_id, token)
    deleteCart(cart_id, token)
  }

  //logout function
   const logOut = () => {
    
    console.log("deleting cart")
    clearProductsAndCart();
    localStorage.clear();
    navigate("/")
  }

  //deletesingleproductfromcart
  const deleteItemAndRefresh = (product_id) =>{
 
  deleteSingleItemFromCart(cart_id, token, product_id);
  getCart(user_id, token).then((response)=> {
    console.log(response)
   setCartItems(response.data.message);
  })
}

// returning dynamic link
useEffect(() => {
  if (cartItems.length > 0) {
    createNewDynamicPaymentLink(cart_id, cartItems, token).then((response) => {
      setLink(response.data)
      console.log(response.data)
    });
  }
}, [cartItems]);

//create new product orders

const createOrder = (user_id, cartItems, token) => {
  if (cartItems.length > 0){
    createNewProductOrders(user_id, cartItems, token).then((response) => {
      alert(response.data.message)
    })
  }
}

  
  if (localStorage.getItem("token")){
    

    return (
      <div>
        <NavLink to="/">Home</NavLink>
        <button onClick={logOut}>Logout</button>
      <h1>Cart</h1>
      <Outlet />
      {cartItems.length > 0 ? cartItems.map((item, key) => {
        
        if(item.image.data && item.image){
                         const buffer = Buffer.from(item.image.data, 'binary');
                      const base64String = buffer.toString('base64');
                    
              return (
                <ul key={item.fk_product_id}>
                  <div>
                  {item.image.data ? <img src={`data:image/jpeg;base64,${base64String}`} style={{width: "200px", height: "200px"}} /> : null}
                  <h3>{item.name}</h3>
                  <h3>${item.price}</h3>
                  <button onClick={() => deleteItemAndRefresh(item.fk_product_id)}>Delete item</button>
                  </div>
                </ul>
              )
            }
            }) : "no products available"}
            <br />
            {cartItems.length > 0 ? <h2>Total price ${totalPrice}</h2> : null}
            {cartItems.length > 0 ? <a href={link} onClick={(e) => {
              e.preventDefault();
              createOrder(user_id, cartItems, token)
              window.location.href = link
            }
              }>Buy now</a> : null}
          
        
    </div>
    )
  }
  
  return (
    <div>
      <h1>You are unauthorized to view cart, please log in or register</h1>
      {navigate('/login')}
    </div>
    
  )
}

export default Cart