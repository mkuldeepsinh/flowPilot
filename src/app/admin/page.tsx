import React from "react";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-black">
        Finance Management Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 text-black">
          <h2 className="font-semibold text-lg mb-2">Total Revenue</h2>
          <p className="text-3xl font-mono">$12,500</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-black">
          <h2 className="font-semibold text-lg mb-2">Expenses</h2>
          <p className="text-3xl font-mono">$7,200</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-black">
          <h2 className="font-semibold text-lg mb-2">Profit</h2>
          <p className="text-3xl font-mono">$5,300</p>
        </div>
      </div>
    </div>
  );
}
