const Bill = require("../models/Bill");
const { sendBillEmail: sendEmailHelper } = require("../utils/email");

// Create a new bill
exports.createBill = async (req, res) => {
  try {
    const { customerName, customerEmail, amount, description, dueDate } =
      req.body;

    if (!customerName || !customerEmail || !amount || !dueDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const paymentLinkBase =
      process.env.FRONTEND_URL || "http://localhost:5173";

    const bill = await Bill.create({
      customerName,
      customerEmail,
      amount,
      description,
      dueDate,
      createdBy: req.userId,
      paymentLink: `${paymentLinkBase}/pay/`,
    });

    // Add id to payment link
    bill.paymentLink = `${paymentLinkBase}/pay/${bill._id}`;
    await bill.save();

    res.status(201).json(bill);
  } catch (error) {
    console.error("Create bill error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all bills (for admin)
exports.getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find().sort({ createdAt: -1 });
    res.json(bills);
  } catch (error) {
    console.error("Get bills error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get bill by id
exports.getBillById = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) return res.status(404).json({ message: "Bill not found" });
    res.json(bill);
  } catch (error) {
    console.error("Get bill error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete bill
exports.deleteBill = async (req, res) => {
  try {
    const bill = await Bill.findByIdAndDelete(req.params.id);
    if (!bill) return res.status(404).json({ message: "Bill not found" });
    res.json({ message: "Bill deleted" });
  } catch (error) {
    console.error("Delete bill error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Send bill via email
exports.sendBillEmail = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) return res.status(404).json({ message: "Bill not found" });

    const paymentLink =
      bill.paymentLink ||
      `${process.env.FRONTEND_URL || "http://localhost:5173"}/pay/${bill._id}`;

    await sendEmailHelper({
      to: bill.customerEmail,
      subject: `Invoice for ${bill.customerName}`,
      html: `
        <h3>Hello ${bill.customerName},</h3>
        <p>You have a new bill for ₹${bill.amount}.</p>
        <p>Description: ${bill.description || "No description"}</p>
        <p>Due Date: ${new Date(bill.dueDate).toDateString()}</p>
        <p><a href="${paymentLink}">Pay Now</a></p>
      `
    });

    res.json({ message: "Email sent" });
  } catch (error) {
    console.error("Send email error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
