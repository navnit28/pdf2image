var express = require("express");
var router = express.Router();
const axios=require('axios')
// const pdf2base64 = require('pdf-to-base64');
const fs = require('fs');
const FormData = require('form-data');
var app = express();
// var PDFImage = require("pdf-image").PDFImage;
// import {default as pdfConverter} from 'pdf-poppler'
const path = require('path');
// const pdf = require('pdf-poppler');
const pdf2img = require('pdf-img-convert');
const { ImageMagick } = require('pdf-images');

async function convertImage(pdfPath) {
    pdfArray = await pdf2img.convert('./file.pdf');
    for (i = 0; i < pdfArray.length; i++){
        fs.writeFile("output"+i+".png", pdfArray[i], function (error) {
          if (error) { console.error("Error: " + error); }
        }); //writeFile
      }
    // await pdf.info(file)
    // .then(pdfinfo => {
    //     console.log(pdfinfo);
    //     console.log(path.dirname(file));
    //     console.log(path.basename(file,path.extname(file)));
    // });
 
    // let opts = {
    //     format: 'jpeg',
    //     out_dir: path.dirname(file),
    //     out_prefix: path.basename(file,path.extname(file)),
    //     page: 1
    // }
 
    // await pdf.convert(file, opts)
    //     .then(res => {
    //         console.log('Successfully converted')
    //     })
    //     .catch(error => {
    //         console.error(error)
    //     })
}
async function convertImage1(){
    try{
    const result = await ImageMagick.convert('./file.pdf', 'outputName', 'outputName');
    console.log(result);
    }
    catch(error){
        console.log(error);
        res.status(500).send(error);
    }
}
// async function splitPdf(pathToPdf) {

//     const docmentAsBytes = await fs.promises.readFile(pathToPdf);

//     // Load your PDFDocument
//     const pdfDoc = await PDFDocument.load(docmentAsBytes)

//     const numberOfPages = pdfDoc.getPages().length;


//         // Create a new "sub" document
//         const subDocument = await PDFDocument.create();
//         // copy the page at current index
//         const [copiedPage] = await subDocument.copyPages(pdfDoc, [0])
//         subDocument.addPage(copiedPage);
//         const pdfBytes = await subDocument.save()
//         await writePdfBytesToFile(`file.pdf`, pdfBytes);

// }
// async function writePdfBytesToFile(fileName, pdfBytes) {
//     return fs.promises.writeFile(fileName, pdfBytes);
// }
// const Base64toFile = async(dataurl, filename,fileType) => {
//     fs.writeFile(`./${filename}_dubai_residence_visa.${fileType}`, dataurl, "base64", function (err) {
//         console.log(err);
//     });
// };
app.get("/pdfpng", async function(req, res) {
    // spliting the pdf
    // try{
    //     await splitPdf("./public/uploads/sample.pdf");
    //     console.log("pdf splitted successfully");
    //     }
    // catch (err)
    // {
    //     res.status(500).send(err);
    // }
    try{
    await convertImage();
    //res.status(200).send("image converted successfully");
    const pic_data=new FormData();
    pic_data.append('form_id','010be335-7569-4f4e-b790-846b4d2745b5');
    pic_data.append('image',fs.createReadStream('./output0.png'));
    console.log("formx api started")
    const response =await axios({
        method: 'post',
        url: 'https://worker.formextractorai.com/extract',
        data: pic_data,
        headers: {
            'Content-Type': 'multipart/form-data',
            'X-WORKER-FORM-ID': '010be335-7569-4f4e-b790-846b4d2745b5',
            'X-WORKER-TOKEN':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiZjNiYWUzNDctMzdmMC00YWQyLWIzMTAtNTVmNDg4ZjhlZTE5In0.uVpnLbn9MSTfiqtt4lg4PU7js5HY6fMeFXJcNysukpk',
            ...pic_data.getHeaders()
        }
    })
    console.log(response.data)
    res.json({
        message:'Ping Route',
        data:response.data
    });
    }
    catch(err)
    {
        console.log(err)
        console.log(err.response.data)
        res.status(500).send(err);
    }

});

app.listen(3200, function () { 
    console.log('App listening on port 3200!'); 
   });