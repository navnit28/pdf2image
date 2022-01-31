var express = require("express");
var router = express.Router();
const {
  fromPath
} = require("pdf2pic");
const pdf2base64 = require('pdf-to-base64');
const fs = require('fs');
const PDFDocument = require('pdf-lib').PDFDocument;
var app = express();
var PDFImage = require("pdf-image").PDFImage;
// import {default as pdfConverter} from 'pdf-poppler'
const path = require('path');
const pdf = require('pdf-poppler');

function convertImage(pdfPath) {
    console.log("converting image");
    let file = './file.pdf'
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
            console.log('Successfully converted')
        })
        .catch(error => {
            console.error(error)
        })
}
async function splitPdf(pathToPdf) {

    const docmentAsBytes = await fs.promises.readFile(pathToPdf);

    // Load your PDFDocument
    const pdfDoc = await PDFDocument.load(docmentAsBytes)

    const numberOfPages = pdfDoc.getPages().length;


        // Create a new "sub" document
        const subDocument = await PDFDocument.create();
        // copy the page at current index
        const [copiedPage] = await subDocument.copyPages(pdfDoc, [0])
        subDocument.addPage(copiedPage);
        const pdfBytes = await subDocument.save()
        await writePdfBytesToFile(`file.pdf`, pdfBytes);

}
async function writePdfBytesToFile(fileName, pdfBytes) {
    return fs.promises.writeFile(fileName, pdfBytes);
}
const Base64toFile = async(dataurl, filename,fileType) => {
    fs.writeFile(`./${filename}_dubai_residence_visa.${fileType}`, dataurl, "base64", function (err) {
        console.log(err);
    });
};
app.get("/pdfpng", async function(req, res) {
    //spliting the pdf
    try{
        await splitPdf("./public/uploads/sample.pdf");
        console.log("pdf splitted successfully");
        }
    catch (err)
    {
        res.status(500).send(err);
    }
    try{
        convertImage("./file.pdf");
        res.send("success");
    }
    catch(err)
    {
        res.status(500).send(err);
    }

});

app.listen(3200, function () { 
    console.log('App listening on port 3200!'); 
   });