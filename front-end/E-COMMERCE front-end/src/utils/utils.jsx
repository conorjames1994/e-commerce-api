import { useNavigate } from "react-router";
import { useCallback } from "react";

 export const clearProductsAndCart = (cart_id, token) => {
    
    deleteCart(cart_id, token)
  }

 
 export const logOut = (cart_id, token, navigate) => {
    
    localStorage.clear();
    console.log("deleting cart")
    clearProductsAndCart(cart_id, token);
    navigate("/")
  }




//API calls
import axios from "axios"
const API = "http://localhost:3000/";

export const getAllProducts = async () => {
    const response = await axios.get(`${API}products`)
    return response.data.message
}

export const getAllCategory = async (category) => {
    const response = await axios.get(`${API}products/${category}`)
    return response.data.message
}

export const sendLoginDetails = async (userName, password) => {
    const response = await axios.post(`${API}login`, {username: userName,
         password: password})
    return response
}

export const sendRegisterDetails = async (name, email, userName, password) => {
    const response = await axios.post(`${API}register`, {username: userName, password: password, email: email, name:name})
    
    return response
}

//get cart

export const getCart = async (user_id, token) => {
   
    const response = await axios.get(`${API}cart/${user_id}`, {headers: {Authorization: token}})
    return response
}

export const deleteCart = async (cart_id, token) => {
    console.log("runnning delete cart")
    const response = await axios.delete(`${API}cart/${cart_id}`, {headers: {Authorization: token}})
    console.log(response)
    return response
}

//delete single item from cart
export const deleteSingleItemFromCart = async (cart_id, token, product_id) => {
    console.log("running delete single item")

    const response = await axios.patch(`${API}cart/${cart_id}`, {product_id: product_id}, {headers: {Authorization: token}},);
    console.log(response)
    return response
}


// add item to cart
export const addItemToCart = async (cart_id, token, product_id) => {
    console.log("running add single item to cart")
    
    const response = await axios.post(`${API}cart/${cart_id}`, {product_id: product_id}, {headers: {Authorization: token}});
    console.log(response)
    return response
}

// create dynamic payment link

export const createNewDynamicPaymentLink = async (cart_id, products, token) => {
    console.log("running getdynamicpaymentlink")
    const response = await axios.post(`${API}cart/${cart_id}/create-payment-link`, {products: products}, {headers: {Authorization: token}});
    
    return response
}

// get users orders

export const showOrders = async (user_id, token) => {
    console.log("showing user's orders")
    const response = await axios.get(`${API}ordershistory/${user_id}`, {headers: {Authorization: token}})
    return response
}

// post new product orders after checkout
export const createNewProductOrders = async (user_id, products, token) => {
    console.log("create new product order")
    const response = await axios.post(`${API}orders/${user_id}`, products, {headers: {Authorization: token}});
    
    return response
}

export const postNewUser = async (name, username, email, password, token) => {
    console.log("adding user to db")
    const response = await axios.post(`${API}postuser`, {name, username, email, password}, {headers: {Authorization: token}});
    return response
}

export const randomUsernameGenerator = (name) => {
    let number = Math.floor(Math.random() * 100)
    number = number.toString()
    return (`${name}${number}`)
};