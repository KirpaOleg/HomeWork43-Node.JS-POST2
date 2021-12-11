const express = require('express');

const router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  
  console.log(req.query); // данные после ? разделение между ними через &
  console.log(req.params); // все что до слеша и после роутера
  res.send('respond with a resource form users');
});

module.exports = router;
