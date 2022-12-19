// async function handler(event, context, callback) {
//   const chromium = require('chrome-aws-lambda');
//   let browser = null;
//   browser = await chromium.puppeteer.launch({
//     args: chromium.args,
//     defaultViewport: chromium.defaultViewport,
//     executablePath: await chromium.executablePath,
//     headless: chromium.headless,
//     ignoreHTTPSErrors: true,
//   });
//   let page = await browser.newPage();
//   await page.goto('https://s3.us-east-2.amazonaws.com/fs.agentemotor.com/public_apps/co/offers-resume-dev/index.html?exportpdf=true&id=730&token=42ede136-ee2e-410b-adec-1aa6098ab8b8', { waitUntil: 'networkidle0' });
//   var pdfElement = null;
//   var pdfName = null;
//   while (!pdfElement){
//     try {
//       pdfElement = await page.$eval('#pdfwrapper', element => element.getAttribute("href"));
//       pdfName = await page.$eval('#pdfwrapper', element => element.getAttribute("name"));
//     } catch (error) {
//       console.log(error);
//     }
//   }
//   const pdfBuffer = Buffer.from(pdfElement, 'base64');
//   console.log(pdfBuffer, pdfName)
//   await browser.close();

//   let response = {
//     statusCode: 200,
//     headers: {'Content-type' : 'application/pdf',
//     "Content-Disposition": `attachment; filename="${pdfName}.pdf"`},
//     body: pdfElement,//Devolver base 64
//     isBase64Encoded : true,
//   };
//   return callback(null, response);
// }

// module.exports = {
//   handler,
// };
