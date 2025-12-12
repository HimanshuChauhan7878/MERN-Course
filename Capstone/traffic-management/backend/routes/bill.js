const express = require("express");
const router = express.Router();

const {
  createBill,
  getAllBills,
  getBillById,
  deleteBill,
  sendBillEmail
} = require("../controllers/billController");
const { authMiddleware } = require("../middleware/auth");

router.post("/create", authMiddleware, createBill);
router.get("/", authMiddleware, getAllBills);
router.get("/:id", authMiddleware, getBillById);
router.delete("/:id", authMiddleware, deleteBill);
router.post("/send-email/:id", authMiddleware, sendBillEmail);

module.exports = router;
