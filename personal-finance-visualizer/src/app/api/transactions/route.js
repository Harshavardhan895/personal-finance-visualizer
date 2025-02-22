import dbConnect from "@/lib/mongodb";  // Import the MongoDB connection
import Transaction from "@/lib/models/Transaction"; // Import the Transaction model

export async function GET() {
  try {
    await dbConnect(); // Connect to MongoDB
    const transactions = await Transaction.find(); // Fetch all transactions
    return Response.json({ success: true, data: transactions }, { status: 200 });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect(); // Connect to MongoDB
    const { title, amount, category } = await req.json(); // Parse request body
    const transaction = new Transaction({ title, amount, category });
    await transaction.save(); // Save transaction to DB
    return Response.json({ success: true, data: transaction }, { status: 201 });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
