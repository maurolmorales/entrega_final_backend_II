import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true },
    amount: { type: Number },
    purchaser: { type: String },
    details: { type: Array },
  },
  { timestamps: true }
);

export default mongoose.model("Tickets", ticketSchema);
