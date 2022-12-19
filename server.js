// const express = require("express");
// const app = express();
// const cors = require("cors");
const chromium = require('chrome-aws-lambda');
// const port = 3001;

// app.use(cors());
// app.get("/", async (req, res) => {
//   try{
//     const [pdfBuffer,pdfName] = await main()
//     res.set("Content-Type", "application/pdf");
//     console.log(pdfBuffer)
//     res.set("Content-Disposition", `attachment; filename="${pdfName}.pdf"`);
//     res.status(200).send(pdfBuffer);
//   }catch(e) {
//     res.send(e)
//   }
// });

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });

async function main() {
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
  var pdfName = null;
  while (!pdfElement){
    try {
      pdfElement = await page.$eval('#pdfwrapper', element => element.getAttribute("href"));
      pdfName = await page.$eval('#pdfwrapper', element => element.getAttribute("name"));
    } catch (error) {
      console.log("error");
    }
  }
  const pdfBuffer = Buffer.from(pdfElement, 'base64');
  console.log(pdfBuffer, pdfName)
  await browser.close();
  return [pdfBuffer,pdfName]
}

main()

