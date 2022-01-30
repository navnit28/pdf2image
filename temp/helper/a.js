// import {default as pdfConverter} from 'pdf-poppler'
const path = require('path');
const pdf = require('pdf-poppler');

function convertImage(pdfPath) {
    console.log("converting image");
    let file = 'C:\\Users\\mishr\\Desktop\\myapp\\file.pdf'
    pdf.info(file)
    .then(pdfinfo => {
        console.log(pdfinfo);
        console.log(path.dirname(file));
        console.log(path.basename(file,path.extname(file)));
    });
 
    let opts = {
        format: 'jpeg',
        out_dir: path.dirname(file),
        out_prefix: path.basename(file,path.extname(file)),
        page: 1
    }
 
    pdf.convert(file, opts)
        .then(res => {
            console.log('Successfully converted');
        })
        .catch(error => {
            console.error(error);
        })
}

module.exports= convertImage