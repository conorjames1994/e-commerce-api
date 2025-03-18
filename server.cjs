const express = require('express');
const swaggerJSDoc = require('swagger-jsdoc');
require('dotenv').config()
const route = require('./queries.cjs')
const bodyParser = require('body-parser');
const passport = require('passport');
require('./passport.cjs');
const jwt = require('jsonwebtoken');
const isAdmin  = require('./utils.cjs').isAdmin;


//setup
const swaggerDefinition = {
  info: {
    title: 'Node Swagger API',
    version: '1.0.0',
    description: 'Demonstrating how to describe a RESTful API with Swagger',
  },
  host: 'localhost:3000',
  basePath: '/',
};

// options for the swagger docs
const options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: ['./server.cjs'],
};

// initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

const app = express()
const PORT = process.env.PORT

//middleware
app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}));
app.use(passport.initialize());
const authenticateMiddleware = passport.authenticate('jwt', {session: false});



app.get('/', (req,res) => {
  res.status(200).json({message: 'homepage'
  })
})


//ROUTES


// serve swagger
app.get('/swagger.json', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});


//LOGIN

/**
 * @swagger
 * definitions:
 *   login:
 *     properties:
 *       username:
 *         type: string
 *       password:
 *         type: string
 *       
 */
/**
/**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *       - Login
 *     description: Checks credentials, makes a new cart
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: username, password
 *         description: login object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/login'
 *     responses:
 *       200:
 *         description: Successfully created
 */
app.post('/login', route.login)

/**
 * @swagger
 * definitions:
 *   protected:
 *     properties:
 *       message:
 *         type: string
 */
/**
/**
 * @swagger
 * /protected:
 *   get:
 *     tags:
 *       - protected
 *     description: Allows access to protected area.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: shows the user they are in the protected area
 *         schema:
 *           $ref: '#/definitions/protected'
 */
app.get('/protected', authenticateMiddleware, (req, res) => {
  if(isAdmin(req))
  res.status(200).json({message: 'Admin access'})
  else{
    res.send('User access only')
  }
})

//register
app.post('/register', route.postUser)

//USERS routes
/**
 * @swagger
 * definitions:
 *   Users:
 *     properties:
 *       name:
 *         type: string
 *       email:
 *         type: string
 *       username:
 *         type: integer
 *       password:
 *         type: string
 */
/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     description: returns all users
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of users
 *         schema:
 *           $ref: '#/definitions/users'
 */
app.get('/users', authenticateMiddleware, route.getUsers);
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags:
 *       - users
 *     description: Returns a single user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: users id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: A single user
 *         schema:
 *           $ref: '#/definitions/user'
 */
app.get('/users/:id',authenticateMiddleware, route.getUserById);

/**
 * @swagger
 * /postuser:
 *   post:
 *     tags:
 *       - users
 *     description: Creates a new user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: name, email, username, password
 *         description: user object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/user'
 *     responses:
 *       200:
 *         description: Successfully created
 */
app.post('/postuser', authenticateMiddleware, route.postUser);

/**
 * @swagger
 * /edituser/{id}:
 *   put:
 *     tags: user
 *     description: Updates a single user
 *     produces: application/json
 *     parameters:
 *       name: name, email, username, password
 *       in: body
 *       description: Fields for the user resource
 *       schema:
 *         type: object
 *         $ref: '#/definitions/Puppy'
 *     responses:
 *       200:
 *         description: Successfully updated
 */
app.put('/edituser/:id', authenticateMiddleware, route.editUser);

/**
 * @swagger
 * /deleteuser/{id}:
 *   delete:
 *     tags:
 *       - users
 *     description: Deletes a single user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: userss id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Successfully deleted
 */
app.delete('/deleteuser/:id', authenticateMiddleware, route.deleteUser);

//PRODUCTS routes

/**
 * @swagger
 * definitions:
 *   Products:
 *     properties:
 *       name:
 *         type: string
 *       description:
 *         type: string
 *       price:
 *         type: integer
 *       
 */

/**
 * @swagger
 * /products:
 *   get:
 *     tags:
 *       - Products
 *     description: Returns all products
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of products
 *         schema:
 *           $ref: '#/definitions/Products'
 */
app.get('/products', route.getAllProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     tags:
 *       - Products
 *     description: Returns a single products
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Products's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: A single product
 *         schema:
 *           $ref: '#/definitions/Product'
 */
app.get('/products/:id(\\d+)', route.getProductById);

/**
 * @swagger
 * /products/{name}:
 *   get:
 *     tags:
 *       - Products
 *     description: Returns a array of products by category
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: name
 *         description: products category
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: single or multiple products
 *         schema:
 *           $ref: '#/definitions/Products'
 */
app.get('/products/:name', route.getProductByCategory);

//CARTS routes
/**
 * @swagger
 * /cart/{user_id}:
 *   get:
 *     tags:
 *       - cart
 *     description: Returns a single cart
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: cart_id
 *         description: carts's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: A single cart
 *         schema:
 *           $ref: '#/definitions/cart'
 */

app.get('/cart/:user_id', authenticateMiddleware, route.getYourCart);

/**
 * @swagger
 * /cart:
 *   post:
 *     tags:
 *       - cart
 *     description: Creates a new cart
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user_id
 *         description: cart object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/cart'
 *     responses:
 *       200:
 *         description: Successfully created
 */
app.post('/cart', authenticateMiddleware, route.postNewCart);

//nothing for patch
app.patch('/cart/:id', authenticateMiddleware, route.deleteSingleProductFromCart);

/**
 * @swagger
 * /cart/{id}:
 *   delete:
 *     tags:
 *       - cart
 *     description: Deletes a single cart including all products
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: cart's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Successfully deleted
 */
app.delete('/cart/:id', authenticateMiddleware, route.deleteAllProductsFromCart);

/**
 * @swagger
 * /cart/{id}:
 *   post:
 *     tags:
 *       - cart
 *     description: Creates a new products in cart
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: puppy
 *         description: Puppy object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Puppy'
 *     responses:
 *       200:
 *         description: Successfully created
 */
app.post('/cart/:id', authenticateMiddleware, route.addProductsToCart);

//ORDERS routes

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     tags:
 *       - Orders
 *     description: Returns a single order
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: orders's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: A single order
 *         schema:
 *           $ref: '#/definitions/order'
 */
app.get('/orders/:id', authenticateMiddleware, route.getSpecificOrder);

/**
 * @swagger
 * /ordershistory/{id}:
 *   get:
 *     tags:
 *       - Orders
 *     description: Returns a single all orders by user.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: user's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: A single or multiple orders from a user
 *         schema:
 *           $ref: '#/definitions/ordershistory'
 */
app.get('/ordershistory/:id', authenticateMiddleware, route.getAllOrdersByUser);

/**
 * @swagger
 * /orders/{id}:
 *   post:
 *     tags:
 *       - Orders
 *     description: Creates a new order and products
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: product_id
 *         description: Product object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/order'
 *     responses:
 *       200:
 *         description: Successfully created
 */
app.post('/orders/:id', authenticateMiddleware, route.postOrderAndProduct);

//CHECKOUT
/**
 * @swagger
 * /cart/{id}/checkout:
 *   post:
 *     tags:
 *       - Checkout
 *     description: Creates a new orders from products in cart and validates payment
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: full_name, card_number, cvc
 *         description: Puppy object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/checkout'
 *     responses:
 *       200:
 *         description: Successfully created
 */
app.post('/cart/:id/checkout', authenticateMiddleware, route.checkout)

 module.exports = { isAdmin };
app.listen(PORT, () => console.log(`server running on port ${PORT}`));

