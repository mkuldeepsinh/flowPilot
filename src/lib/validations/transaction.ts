import { z } from "zod"

export const transactionSchema = z.object({
  id: z.number(),
  date: z.string(),
  description: z.string(),
  category: z.string(),
  amount: z.number(),
  type: z.string(),
  status: z.string(),
  account: z.string(),
  color: z.string(),
  client: z.string().optional(),
  invoice: z.string().optional(),
  vendor: z.string().optional(),
  department: z.string().optional(),
}) 