import React, { use } from 'react'
import Login from './login'
import { Register } from './register'
import { NavLink } from 'react-router'
import { getAllProducts } from './utils/utils'
import { useEffect, useState } from 'react'
import { addItemToCart } from './utils/utils'
import { useNavigate } from 'react-router'
import { logOut } from './utils/utils'
import { clearProductsAndCart } from './utils/utils'
import { deleteCart } from './utils/utils'
import { Buffer } from 'buffer'


const Homepage = () => {
const [products, setProducts] = useState([])

const token = localStorage.getItem("token");
const cart_id = localStorage.getItem("cart_id")

const navigate = useNavigate();
 //getallproducts api call
useEffect(() => {

  const resultsFunction = async () => { 
    const result = await getAllProducts()
    console.log(result)
    return result
  };
  resultsFunction().then(productList => {
    if(productList){
      setProducts(productList)
    }
  })
 
}, [])


const addingItemToCart = (product_id) => {
console.log(cart_id, token, product_id)

addItemToCart(cart_id, token, product_id).then((response) => {
  console.log(response)
  alert("Item added to cart")
})
}


if (token && cart_id){
  
  return (
    <div>
      <button onClick={() => logOut(cart_id, token, navigate)}>Logout</button>
      <NavLink to="/cart">Cart</NavLink>
      <NavLink to="/orders">Orders</NavLink>
      <h1>The Arsenal Shop</h1>    
      <div>
         <NavLink to="/categories/hats">Hats</NavLink>
        <NavLink to="/categories/shirts">Shirts</NavLink>
        <NavLink to="/categories/jumpers">Jumpers</NavLink>
        <NavLink to="/categories/coats">Coats</NavLink>  
        </div> 
        <h2>All products</h2>
           <div>
            {products.length > 0 ? products.map((product) => {
             
             if(product.image.data && product.image){
              const buffer = Buffer.from(product.image.data, 'binary');
           const base64String = buffer.toString('base64');

              return (
                <ul key={product.product_id} value={product.product_id}>
                  <div>
                  {product.image.data ? <img src={`data:image/jpeg;base64,${base64String}`} style={{width: "200px", height: "200px"}} /> : null}
                  <h3>{product.name}</h3>
                  <h3>{product.description}</h3>
                  <h3>${product.price}</h3>
                  <button onClick={() => addingItemToCart(product.product_id)}>Add to cart</button>
                  </div>
                </ul>
              )
            }
            }) : "no products available"}
           </div>
    </div>
  )
}

  return (
    <div>
      <NavLink to="/login">Login/Register</NavLink>
      <h1>The Arsenal Shop</h1>    
      <div>
         <NavLink to="/categories/hats">Hats</NavLink>
        <NavLink to="/categories/shirts">Shirts</NavLink>
        <NavLink to="/categories/jumpers">Jumpers</NavLink>
        <NavLink to="/categories/coats">Coats</NavLink>  
        </div> 
        <h2>All products</h2>
           <div>
            {products.length > 0 ? products.map((product) => {   
             
              if(product.image.data && product.image){
                 const buffer = Buffer.from(product.image.data, 'binary');
              const base64String = buffer.toString('base64');
             
          
              return (
                <ul key={product.product_id}>
                  <div>
                  {product.image.data ? <img src={`data:image/jpeg;base64,${base64String}`} style={{width: "200px", height: "200px"}} /> : null}
                  <h3>{product.name}</h3>
                  <h3>{product.description}</h3>
                  <h3>${product.price}</h3>
                  <button onClick={() => navigate("/login")}>Login to add to cart</button>
                  </div>
                </ul>
              )
            }
             }) : "no products available"}
           </div>
    </div>
    
  )
}

export default Homepage