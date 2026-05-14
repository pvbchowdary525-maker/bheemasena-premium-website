const sharp = require('sharp');
sharp('public/bheemasena-frames/ezgif-frame-001.jpg')
  .extract({ left: 0, top: 0, width: 1, height: 1 })
  .raw()
  .toBuffer((err, data) => {
    if(err) throw err;
    console.log(`#${data[0].toString(16).padStart(2,'0')}${data[1].toString(16).padStart(2,'0')}${data[2].toString(16).padStart(2,'0')}`);
  });
