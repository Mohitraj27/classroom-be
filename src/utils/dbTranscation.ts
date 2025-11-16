import { db } from "@/config/db";

/**
 * A reusable wrapper for Drizzle transactions
 *
 * @param callback - the transaction logic you want to run
 * @returns callback result if successful
 */
export async function useTransaction<T>(callback: (trx: any) => Promise<T>): Promise<T> {
  return db.transaction(callback);
}
