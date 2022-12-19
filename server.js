// const express = require("express");
// const app = express();
// const cors = require("cors");
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
  const puppeteer = require("puppeteer");
  let browser = null;
  browser = await puppeteer.launch();
  let page = await browser.newPage();
  await page.goto(
    "https://s3.us-east-2.amazonaws.com/fs.agentemotor.com/public_apps/co/offers-resume-dev/index.html?exportpdf=true&id=730&token=42ede136-ee2e-410b-adec-1aa6098ab8b8",
    { waitUntil: "networkidle0" }
  );
  var pdfElement = null;
  var pdfName = null;
  while (!pdfElement) {
    try {
      pdfElement = await page.$eval("#pdfwrapper", (element) =>
        element.getAttribute("href")
      );
      pdfName = await page.$eval("#pdfwrapper", (element) =>
        element.getAttribute("name")
      );
    } catch (error) {
      console.log("error");
    }
  }
  const pdfBuffer = Buffer.from(pdfElement, "base64");
  console.log(pdfBuffer, pdfName);
  await browser.close();
  return [pdfBuffer, pdfName];
}

main();
