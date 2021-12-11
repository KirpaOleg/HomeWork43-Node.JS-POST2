const express = require('express');
const axios = require('axios');
const router = express.Router();
const multer  = require('multer');
const upload = multer();


const getcountryProperties = async(url) => {
  const region = await axios.get(url);
  // console.log('TEST1 >>>>', region.data);
  const countryProperties = region.data.map((country) => {
    const name = country.name.common;
    const population =  country.population;
    const languages = Object.values(country.languages);
    const currencies = Object.keys(country.currencies)[0];
    const flag = country.flags.png;
    // console.log('TEST2 >>>>', name);
    return{name, population, languages, currencies, flag,}
  });
  console.log('TEST3 >>>>', getcountryProperties);
}

const countryPropertiesHTML = async(element, res) => {
	return res.send(`<div class="counrty">
                          <p>${element.name}</p><br>
                          <div class="flag">
                            <img src= ${element.flag}><br>
                          </div>
                          <div class="text">
                            <p>Population: ${element.population}</p>
                            <p>Languages: ${element.languages}</p>
                            <p>Currencies: ${element.currencies}</p>
                          </div>
                        </div>`)
}

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.post('/', upload.none(), async(req, res, next) => {
  const URL = `https://restcountries.com/v3.1/region/${req.body.region}`;  
  // console.log('TEST0 >>>>', URL);
  
    countryPropertiesHTML(res)
 
});

module.exports = router;

