const fs = require('fs');
const pdf = require('pdf-parse');

const dataBuffer = fs.readFileSync('restaurant_menu.pdf');

pdf(dataBuffer).then(function(data) {
    console.log(data.text);
}).catch(console.error);
