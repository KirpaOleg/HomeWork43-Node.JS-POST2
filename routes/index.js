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
    const cat = [];
    // console.log('TEST2 >>>>', name);
    return{name, population, languages, currencies, flag, cat,}
  });
  // console.log('TEST3 >>>>', countryProperties);
  return countryProperties;
}

const getCatsInfo = async() => {
  const tempArr = await axios.get('https://api.thecatapi.com/v1/breeds');
  const catArr = tempArr.data.map((catObj) => {
    return {
      coutryName: catObj.origin,
      catImgUrl: (!catObj.image) ? null : catObj.image.url,
      breed: catObj.name,
    }
  });
  // console.log('TEST6 >>>>', catArr);
  return catArr;
}

const concatArr = (country, cat) => {
  country.forEach(countryElement =>{
    cat.forEach(catElement => {
      if(countryElement.name === catElement.coutryName){
        countryElement.cat.push(catElement)
      } 
    })
  })
  return country;
}


const genCardsHTML = (element) => {
  // console.log('TEST6 >>>>', element);
  let card = '';
  element.forEach(item => {
    const countryHTML = `
    <div class="counrty">
      <p>${item.name}</p><br>
      <div class="flag">
        <img src= ${item.flag}><br>
      </div>
      <div class="text">
        <p>Population: ${item.population}</p>
        <p>Languages: ${item.languages}</p>
        <p>Currencies: ${item.currencies}</p>
      </div>
    </div><br>`
    const catsHTML = item.cat.map((item) => {
      return `	          
      <div class="cat">   
        <img class="cat-img" src= ${item.catImgUrl}>       
        <p class="cat-name">${item.breed}</p>
			</div>`
    })
    card = `${card}<div class="card">${countryHTML}
                     <div class="cat-card">${catsHTML}
                     </div>
                   </div>`
  })
  return card
}

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.post('/', upload.none(), async(req, res, next) => {
  const URL = `https://restcountries.com/v3.1/region/${req.body.region}`;  
  // console.log('TEST0 >>>>', URL);
  const countrysArray = await getcountryProperties(URL);
  // console.log('TEST4 >>>>', countryArray);
  const catsArray = await getCatsInfo();
  // console.log('TEST8 >>>>', catsArray);
  const countrysAndCatsArray = await concatArr(countrysArray, catsArray)
  // console.log('TEST9 >>>>', catsArray);
  const cardsHTML = await genCardsHTML(countrysAndCatsArray);
  // console.log('TEST6 >>>>', cardsHTML);
  res.send(cardsHTML)
});

module.exports = router;

