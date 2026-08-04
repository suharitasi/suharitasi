/**
 * db.mjs — SQLite veritabani (better-sqlite3)
 */
import Database from 'better-sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_DIR = join(__dirname, '..', 'data');
const DB_PATH = join(DB_DIR, 'orders.db');

if (!existsSync(DB_DIR)) mkdirSync(DB_DIR, { recursive: true });

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

export function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      merchant_oid TEXT UNIQUE NOT NULL,
      package_id TEXT NOT NULL,
      amount INTEGER NOT NULL,
      customer_name TEXT,
      customer_email TEXT,
      customer_phone TEXT,
      customer_tax_id TEXT,
      parcel_info TEXT DEFAULT '',
      status TEXT DEFAULT 'PENDING',
      pdf_path TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
}

export function createOrder(data) {
  const stmt = db.prepare(`
    INSERT INTO orders (merchant_oid, package_id, amount, customer_name,
      customer_email, customer_phone, customer_tax_id, parcel_info, status)
    VALUES (@merchant_oid, @package_id, @amount, @customer_name,
      @customer_email, @customer_phone, @customer_tax_id, @parcel_info, @status)
  `);
  return stmt.run(data);
}

export function getOrder(oid) {
  return db.prepare('SELECT * FROM orders WHERE merchant_oid = ?').get(oid);
}

export function updateOrderStatus(oid, status, pdfPath) {
  const fields = { status };
  if (pdfPath) fields.pdf_path = pdfPath;
  const sets = Object.keys(fields).map(k => `${k} = @${k}`).join(', ');
  db.prepare(`UPDATE orders SET ${sets} WHERE merchant_oid = @oid`).run({ ...fields, oid });
}
