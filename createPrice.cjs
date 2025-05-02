

const createDynamicPaymentLink = async (allItems) => {
const {products} = allItems
const stripe = require("stripe")(process.env.SECRET_KEY);
let line_items = []

function removeDuplicates(products) {
  return [...new Set(products.map(JSON.stringify))].map(JSON.parse);
}
const noDuplicateProducts = removeDuplicates(products);

noDuplicateProducts.forEach((product) => {

  
 switch(product.name){
  case "hat": product.price = "price_1RBHVJP7b5XUfLn81Rk9bSe5";
  break;
  case "coat": product.price = "price_1RBHZZP7b5XUfLn8jk0ZjucF";
  break;
  case "jumper": product.price = "price_1RBHYvP7b5XUfLn8bXbVkrat";
  break;
  case "away shirt": product.price = "price_1RBHY6P7b5XUfLn8HoCjm4PN";
  break;
  case "home shirt": product.price = "price_1RBHXKP7b5XUfLn8W1rjF2AD";
  break;
 }

  const insertProduct = 
  { 
    
    price: product.price,
    quantity: 1
  }
  line_items.push(insertProduct);
  
})

    const paymentLink = await stripe.paymentLinks.create({
      
      line_items,
      payment_method_types: ['card'],
    });
    console.log(paymentLink.url);
   
    // Output: The payment link URL for this combination
    return paymentLink.url

}

module.exports = createDynamicPaymentLink;