const axios = require('axios');
axios.get('https://www.solo-solis.com/media/catalog/product/7/0/7075_2.jpg')
  .then(res => console.log('7075_2 exists'))
  .catch(err => console.log('7075_2 does not exist'));
