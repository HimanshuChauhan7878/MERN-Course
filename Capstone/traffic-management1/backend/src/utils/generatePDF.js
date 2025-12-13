const PDFDocument = require("pdfkit");
const fs = require("fs");

module.exports = (challan, filename) => {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(filename));

  doc.fontSize(20).text("Traffic E-Challan");
  doc.text(`Challan ID: ${challan._id}`);
  doc.text(`Vehicle: ${challan.vehicleNumber}`);
  doc.text(`Violation: ${challan.violationType}`);
  doc.text(`Fine: ₹${challan.fineAmount}`);
  doc.text(`Status: ${challan.status}`);

  doc.end();
};
