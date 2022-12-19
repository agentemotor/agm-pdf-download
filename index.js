const express = require("express");
const compress = require("lz-string");
var bodyParser = require("body-parser");
const puppeteer = require("puppeteer");
const fs = require("fs");
const app = express();
const cors = require("cors");
const port = 3001;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
var jsonParser = bodyParser.json();

app.get("/:name", async (req, res) => {
  try{
    const pdfBuffer = await main()
    res.set("Content-Type", "application/pdf");
    console.log(pdfBuffer)
    res.set("Content-Disposition", `attachment; filename="${req.params.name}.pdf"`);
    res.status(200).send(pdfBuffer);
  }catch(e) {
    res.send(e)
  }
});

app.post("/", jsonParser, (req, res) => {
  content = compress.decompress(req.body.html);
  // console.log(content)
  downloadPDF(content);
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// const downloadPDF = async (content) => {
//   // // Create a browser instance
//   // const browser = await puppeteer.launch();

//   // // Create a new page
//   // const page = await browser.newPage();
//   // // await page.setViewport({deviceScaleFactor:1.5})
//   // //Get HTML content from HTML file
//   // await page.emulateMediaType("screen")
//   // await page.setContent(content, {timeout: 20000, waitUntil: 'networkidle2' });

//   // // Downlaod the PDF
//   // const pdf = await page.pdf({
//   //   // preferCSSPageSize:true,
//   //   path: 'hn' + Date.now() + '.pdf',
//   //   printBackground: true,
//   //   format:"Letter",
//   //   displayHeaderFooter:true,
//   //   scale:1,
//   // });
//   // console.log(pdf)

//   // // Close the browser instance
//   // await browser.close();

//   var html_to_pdf = require("html-pdf-node");

//   let options = { 
//     format: "A4",
//     path:'hn' + Date.now() + '.pdf',
//     printBackground:true,
//    };
//   // Example of options with args //
//   // let options = { format: 'A4', args: ['--no-sandbox', '--disable-setuid-sandbox'] };
   
//   let file = { content: content };
//   html_to_pdf.generatePdf(file, options).then((pdfBuffer) => {
//     console.log("PDF Buffer:-", pdfBuffer);
//   });
// };

async function main() {
  const chromium = require('chrome-aws-lambda');
  const jsdom = require("jsdom");
  let browser = null;
  browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });
  let page = await browser.newPage();
  await page.goto('http://localhost:3000/?exportpdf=true&id=730&token=42ede136-ee2e-410b-adec-1aa6098ab8b8', { waitUntil: 'networkidle0' });
  var pdfElement = null;
  while (!pdfElement){
    const content = await page.content();
    const dom = new jsdom.JSDOM(content);
    pdfElement = dom.window.document.getElementById("pdfwrapper")
    console.log(dom.window.document.getElementById("pdfwrapper"))
  }
  const pdfBuffer = Buffer.from(pdfElement.href, 'base64');
  
  //!forma 
  // const pdfBuffer = await page.pdf({ 
  //   printBackground: true,
  //   path:`example ${Date.now()}.pdf`,
  //   margin: { top: '30px', right: '20px', bottom: 70, left: '20px' },
  //   scale: 1.5,
  //   displayHeaderFooter: true,
  //   footerTemplate: `
  //     <div style="color: #888888; font-size: 6px; padding-right: 1.2cm; text-align: right; width: 100%; font-family: Source Sans Pro;">
  //       <span>Generado con Agentemotor-(Impreso el${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()})</span>
  //     </div>
  //   `,
  // });
  
  await browser.close();
  return pdfBuffer
}

// main()