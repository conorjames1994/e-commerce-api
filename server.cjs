const express = require('express');
require('dotenv').config()

//setup
const app = express()
const PORT = process.env.PORT

app.get('/', (req,res) => {
  res.status(200).json({message: 'successfull'})
})


app.listen(PORT, () => console.log(`server running on port ${PORT}`))