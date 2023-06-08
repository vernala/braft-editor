const sass = require('sass')
const fs = require('fs')


const result = sass.compile('./src/assets/scss/output.scss');

fs.writeFile('./dist/output.css', result.css, (err) =>{
  if(!err){
    // file written on disk
  }
})
