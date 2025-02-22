"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Backend API URL
const API_URL = "http://localhost:3000/api/transactions";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ title: "", amount: "", date: "", category: "" });

  // Fetch Transactions
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setTransactions(data.data || []));
  }, []);

  // Handle Form Change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add Transaction
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.amount || !form.date || !form.category) {
      alert("Please fill out all fields.");
      return;
    }
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const newTransaction = await res.json();
    setTransactions([...transactions, newTransaction.data]);
    setForm({ title: "", amount: "", date: "", category: "" });
  };

  // Delete Transaction
  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    setTransactions(transactions.filter((tx) => tx._id !== id));
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      {/* Form */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h2 className="text-xl font-bold">Add Transaction</h2>
          <Input placeholder="Title" name="title" value={form.title} onChange={handleChange} />
          <Input placeholder="Amount" name="amount" type="number" value={form.amount} onChange={handleChange} />
          <Input placeholder="Date" name="date" type="date" value={form.date} onChange={handleChange} />
          <Input placeholder="Category (e.g. Food, Rent, Shopping)" name="category" value={form.category} onChange={handleChange} />
          <Button onClick={handleSubmit}>Add Transaction</Button>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <div className="mt-4 space-y-2">
        <h2 className="text-lg font-bold">Transactions</h2>
        {transactions.length === 0 ? (
          <p className="text-gray-500">No transactions added yet.</p>
        ) : (
          transactions.map((tx) => (
            <Card key={tx._id}>
              <CardContent className="p-2 flex justify-between items-center">
                <div>
                  <span className="font-semibold">{tx.title}</span> ({tx.category}) - {tx.date}
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-green-600 font-bold">₹{tx.amount}</span>
                  <Button variant="destructive" onClick={() => handleDelete(tx._id)}>Delete</Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Chart */}
      <div className="mt-6">
        <h2 className="text-lg font-bold">Monthly Expenses</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={transactions} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
            <XAxis 
              dataKey="category" 
              angle={-45} 
              textAnchor="end" 
              interval={0} 
              tick={{ fontSize: 12 }} 
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#8884d8" barSize={50} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
