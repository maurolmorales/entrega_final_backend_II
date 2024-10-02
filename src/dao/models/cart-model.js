import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  products: {
    type: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: {type: Number, default: 1},
      },
    ],
    default: [],
  },
  date: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["open", "complete", "canceled"],
    default: "open",
  },
});
export default mongoose.model("Cart", cartSchema);
