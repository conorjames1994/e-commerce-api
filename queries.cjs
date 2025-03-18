const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const todaysDate = require('./utils.cjs').currentDate;
const isAdmin  = require('./utils.cjs').isAdmin;
// setup postgres connection

const Pool = require('pg').Pool

const pool = new Pool({
 user: 'me',
 host: 'localhost',
 database: 'E-COMMERCE-API',
 password: 'password',
 port: 5432
});

//route functions

// this stores user_id after login
let payload;

//LOGIN
const login = async(req, res) => {
  try {
    console.log('login running')
    const {username, password} = req.body;
    const results = await pool.query('SELECT * FROM users WHERE username = $1', [username])
   
      if(results.rows.length === 0){
        console.log('Error getting results, retry username or register new user')
        res.status(400).json({message: 'Error getting results, retry username or register new user'})
      }
    console.log('matching password')
    let match = bcrypt.compareSync(password, results.rows[0].password)
      
      if(!match){
        console.log('match error')
        res.status(401).json({message: 'password doesnt match'})
      }
      
      else if(match){
         if(results.rows[0].is_admin === true){
           console.log('admin')
         }
        console.log('creating payload')
        
      payload = {
        user_id: results.rows[0].user_id,
        username: username,
        password: password,
        is_admin: results.rows[0].is_admin
      };
       //creating auth token
      const token = jwt.sign(payload, 'imasecretkey', {expiresIn: '1d'})
       console.log('token sent, logged in');

       //auto create new cart
       console.log('running create new cart')
      const user_id = payload.user_id;
  
      await pool.query('INSERT INTO cart(fk_user_id) VALUES($1) RETURNING *', [user_id]) 
      res.status(200).json({message: `${username} logging in, new cart created`,
      token: 'Bearer ' + token});

      }
    
    } catch (error) {
    console.log('error outside queries')
    res.status(500).json({message: error})
  } finally {
  return;
 }
};
//register
//we will use the postuser function to niput details into db.

//USERS

const getUsers = (req, res) => {
  
  if(isAdmin(req) === true){
    console.log('getuser running')
  pool.query('SELECT * FROM users ORDER BY user_id ASC', (err, results) => {
    if(err){
      console.log('ERROR')
      res.status(400).json({error: err})
      throw(err)
    } 
      console.log('success')
      res.status(200).json(results.rows)
  
  }) 
  }
  else{
    res.status(400).json({message: 'You need to be admin to access this data'})
  }
 
};

//getbyid

const getUserById = (req, res) => {
  console.log('getuserbyid running')
  const id = parseInt(req.params.id)
  pool.query('SELECT * FROM users WHERE user_id = $1', [id], (err, results) => {
    if (err) {
      console.log('error')
      res.status(400)
      throw(err)
    } 
    res.status(200).json(results.rows)
  })
};

//postuser

const postUser = async (req, res) => {
if(isAdmin(req) === true){
    try{

 console.log('postuser running');
 
  const { name, email, username} = req.body;
 let password = bcrypt.hashSync(req.body.password, 10);
 
   const results = await pool.query('INSERT INTO users VALUES( $1, $2, $3, $4) RETURNING *', [name, email, username, password]);
   res.status(201).json({message: `${results.rows[0].username} added to users`})

  }
  catch(err){
    console.log(err)
    res.status(400).json({message: err.message});
  } finally {
 return;
};
}
else{
  res.status(400).json({message: 'You must be admin to access this information'})
}
};

const editUser = (req, res) => {
  console.log('edituser running');
 const id = parseInt(req.params.id);
  const { name, email, username, password } = req.body;

  pool.query('UPDATE users SET name = $1, email = $2, username = $3, password = $4 WHERE user_id = $5 RETURNING *', [name, email, username, password, id], (err, results) => {
    if(err){
      console.log("edituser err")
      res.status(400).send(err)
      throw(err)
    }
    res.status(200).json({message: `new details {id-${id}, name-${name}, email-${email}, username-${username}, password-${password}} saved `})
    console.log('successfull edit')
  })
};

const deleteUser = (req, res) => {

  if(isAdmin(req) === true){
 console.log('deleteuser running')
  const id = parseInt(req.params.id);


  pool.query('DELETE FROM users WHERE user_id = $1 RETURNING *', [id], (err, results) => {
    
    if(err){
      console.log('delete error')
     
      res.status(400).json({error: err});
      throw(err);
    }
    res.status(200).json({message: `user_id - ${id} deleted succesfully`})
  })

  }
  else{
    res.status(400).json({message: 'You must be admin to access this information'})
  }
 
};

//PRODUCTS

const getAllProducts = (req, res) => {
  console.log('products get all running');
pool.query('SELECT * FROM products ORDER BY product_id ASC', (err, results) => {
  if(err){
    console.log(err);
  res.status(400).json(err)
  throw(err);
  }
  res.status(200).json({message: results.rows})
})
};

const getProductById = (req, res) => {
  console.log('getproductbyid running');
  const id = parseInt(req.params.id);

  pool.query('SELECT * FROM products WHERE product_id = $1', [id], (err, results) => {
    if(err){
      console.log(err)
      res.status(400).json(err)
      throw(err)
    }

    res.status(200).json({message: results.rows[0]})
  })
};

const getProductByCategory = (req, res) => {
  console.log('getproductbycategory running');
  
  const name = String(req.params.name);
 

  pool.query('SELECT * FROM products WHERE name = $1', [name], (err, results) => {
    if(err){
      console.log(req.params);
      res.status(400).json(err)
      throw(err)
    }

    res.status(200).json({message: results.rows})
  })
};

//CARTS

// view your own cart
const getYourCart = (req, res) => {
  console.log('running getyourcart')
  
 const user_id = parseInt(req.params.user_id)

 pool.query('SELECT cart_id, fk_product_id, name, price FROM cart, carts_products, products WHERE fk_user_id = $1 AND cart_id = fk_cart_id AND fk_product_id = product_id', [user_id], (err, results) => {
  if(err){
    console.log('error in query')
    throw(err)
  }
  res.status(200).json({message: results.rows})
 })
};

//ADD PRODUCTS TO CART
const addProductsToCart = (req, res) => {
  console.log('addproductstocart running');
   const cart_id = parseInt(req.params.id)
   const product_id = req.body.product_id;
  pool.query('INSERT INTO carts_products VALUES($1, $2) RETURNING *', [cart_id, product_id], (err, results) => {
    if(err){
      console.log('error in query');
      throw(err)
    }
    console.log(results.rows)
    res.status(200).json({message: `Product ${product_id} added to cart ${cart_id}`})
  })
}
//creating a new cart within login POST
const postNewCart = (req, res) => {
   
   console.log('running create new cart')
  
    const user_id = parseInt(req.body.user_id)
  
   pool.query('INSERT INTO cart(fk_user_id) VALUES($1) RETURNING *', [user_id.user_id], (err, results) => {
     if(err){
       console.log('cart generation error')
       throw(err)
     }
     res.status(200).json({message: `cart generated with cart_id ${results.rows[0].cart_id}`})
   }) 
};

//DELETE SINGLE PRODUCT IN CART 
const deleteSingleProductFromCart = (req, res) => {
  console.log('running deletesingleproductfromcart')
  const cart_id = parseInt(req.params.id)
  console.log(req.body)
   
   
  pool.query('DELETE FROM carts_products WHERE fk_cart_id = $1 AND fk_product_id = $2', [cart_id, req.body.product_id], (err, results) => {
    if(err){
      console.log('error in query')
      throw(err)
    }
    res.status(200).json({message: `Product id - ${req.body.product_id} sucessfully deleted`})
  })
};

//delete all from cart

const deleteAllProductsFromCart = (req, res) => {
  console.log('deltetallproductsfromcart');

  const cart_id = parseInt(req.params.id)
  pool.query('DELETE FROM carts_products WHERE fk_cart_id = $1', [cart_id], (err, results) => {
    if(err){
      console.log('error in query')
    }
    res.status(200).json({message: `All products in cart - ${cart_id} deleted`})
  })
};

//ORDERS routes
//get order by id
const getSpecificOrder = (req, res) => {
  if(isAdmin(req) === true){
 console.log('running seespecificorder');
  const id = parseInt(req.params.id);
  pool.query('SELECT * FROM orders WHERE order_id = $1', [id], (err, results) => {
    if(err){
      console.log('error in query')
      throw(err)
    }
    res.status(200).json({message: results.rows})
  });
  }
  else{
   res.status(400).json({message: 'Only admin can access this data'})
  }
 

};

//get all orders history
const getAllOrdersByUser = (req, res) => {
  console.log('getallordersrunning');
   const id = parseInt(req.params.id);
  pool.query('SELECT order_id, status, order_date, fk_user_id, name, description, price FROM orders, products_orders, products WHERE fk_user_id = $1 AND order_id = fk_order_id AND fk_product_id = product_id', [id], (err, results) => {
    if(err){
      console.log('error in query');
      throw(err)
    }
    res.status(200).json({message: results.rows})
  })
};

//post an order and products
const postOrderAndProduct = (req, res) => {
  console.log('postorderandproduct running');
  const user_id = parseInt(req.params.id)
  const { product_id } = req.body
   const status = 'Ordered';
   const date = todaysDate;
  pool.query('INSERT INTO orders(status, order_date, fk_user_id) VALUES ($1, $2, $3) RETURNING order_id AS order_id ', [status, date, user_id], (err, results) => {
    if(err){
      console.log('error in query1');
      throw(err);
    }
    const order_id = results.rows[0].order_id;
   
    pool.query('INSERT INTO products_orders VALUES($1, $2)', [product_id, order_id], (err, results) => {
      if(err){
        console.log('error in query2');
        throw(err);
      }

       res.status(200).json({message: `${status}, ${date}, ${user_id}, ${product_id}, ${order_id} added to orders and order_products`})
    })
   
  })
};

//CHECKOUT route
//validates the specific cart, recieves payment info, if valid then posts new order with cart-products
const checkout = async (req, res) => {
  console.log('checkout running');
  const cart_id = parseInt(req.params.id)
try {
  // gets all of a carts products
  const results = await pool.query('SELECT cart_id, fk_user_id, fk_product_id, name, price FROM cart, carts_products, products WHERE cart_id = $1 AND cart_id = fk_cart_id AND fk_product_id = product_id;', [cart_id]);
  const cart_data = results.rows;
  const user_id = cart_data[0].fk_user_id;
  

  //check payment info
  const {full_name, card_number, cvc} = req.body;
  
  
  const validpayment = await pool.query('INSERT INTO card_payments(full_name, card_number, cvc, fk_user_id) VALUES ($1, $2, $3, $4)', [full_name, card_number, cvc, user_id]);
  
console.log('payment validated');
const status = 'ordered';
const date = todaysDate;

if(validpayment){
console.log('running insert into orders')
  const data = await pool.query('INSERT INTO orders(status, order_date, fk_user_id) VALUES ($1, $2, $3) RETURNING *', [status, date, user_id]);
console.log('order created');
 const order_data = data.rows;
 
//adding products from cart to products_orders
console.log('running insert into product_orders');
 for(let a = 0; a < cart_data.length; a++){
 for(let b = 0; b < order_data.length; b++){
   if(cart_data[a].fk_user_id === order_data[b].fk_user_id){
      pool.query('INSERT INTO products_orders VALUES ($1, $2)', [cart_data[a].fk_product_id, order_data[b].order_id])
   }
 }
};
console.log('products added')
res.status(200).json(`Cart ${cart_id} read, payment validated, order created and products saved to orders`)
}


} catch (err) {
  console.log('error in queries')
  
}
}

module.exports = {
  getUsers, 
  getUserById,
  postUser,
  editUser,
  deleteUser,
  login,
  pool,
  getAllProducts,
  getProductById,
  getProductByCategory,
  postNewCart,
  getYourCart,
  deleteSingleProductFromCart,
  deleteAllProductsFromCart,
  addProductsToCart,
  getSpecificOrder,
  getAllOrdersByUser,
  postOrderAndProduct,
  checkout
}

