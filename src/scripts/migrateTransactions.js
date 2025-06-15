import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Transaction from '../models/transactionModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGODB_URI = 'mongodb+srv://finance:RvBl7fXGDseKNJpB@finance01.aipujdi.mongodb.net/';

async function migrateTransactions() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Read the transaction data
    const transactionData = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, '../app/dashboard/transaction/transaction-data.json'),
        'utf8'
      )
    );

    // Transform the data to match our schema
    const transactions = transactionData.transactions.map(transaction => ({
      date: new Date(transaction.date),
      description: transaction.description,
      category: transaction.category,
      amount: transaction.amount,
      type: transaction.type,
      status: transaction.status,
      account: transaction.account,
      color: transaction.color,
      client: transaction.client || null,
      vendor: transaction.vendor || null,
      invoice: transaction.invoice || null,
      department: transaction.department || null,
      payment_id: transaction.payment_id || null,
      companyId: 'COMP_1749635591705_32zce2bpo' // You'll need to replace this with actual company IDs
    }));

    // Clear existing transactions (optional)
    await Transaction.deleteMany({});
    console.log('Cleared existing transactions');

    // Insert the new transactions
    const result = await Transaction.insertMany(transactions);
    console.log(`Successfully migrated ${result.length} transactions`);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
migrateTransactions(); 