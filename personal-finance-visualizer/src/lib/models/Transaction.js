import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now },
  decription: {type:String,}
});

export default mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);
