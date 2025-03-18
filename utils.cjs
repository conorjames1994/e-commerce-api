const date = new Date();
const jwt = require('jsonwebtoken');

let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();

// This arrangement can be altered based on how we want the date's format to appear.
let currentDate = `${year}-${month}-${day}`;
console.log(currentDate)

const isAdmin = (req) => {
 const token = req.headers.authorization;
 let formattedToken = token.replace('Bearer ', '')

 if(!formattedToken){
  console.log('invalid token')
  return false
 }
 console.log('valid token now decoding')
 const decoded =  jwt.verify(formattedToken, 'imasecretkey');
 console.log(decoded)
 if(decoded.is_admin === true){
  console.log('admin accessing')
   return true
 }
 else {
  console.log('Unfortunately only admin can access')
  return false
 }
}

module.exports = {currentDate, isAdmin};