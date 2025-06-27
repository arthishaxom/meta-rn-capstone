import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('little_lemon.db');

export async function createTable() {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS menu (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      price REAL,
      description TEXT,
      image TEXT,
      category TEXT
    );
  `);
}

export async function insertMenuItems(items: any[]) {
  for (const item of items) {
    await db.runAsync(
      'INSERT INTO menu (title, price, description, image, category) VALUES (?, ?, ?, ?, ?)',
      [item.title, item.price, item.description, item.image, item.category]
    );
  }
}

export async function getCategories(): Promise<string[]> {
  const rows = await db.getAllAsync('SELECT DISTINCT category FROM menu');
  return rows.map((row: any) => row.category);
}

export async function filterMenu(categories: string[], search: string): Promise<any[]> {
  let query = 'SELECT * FROM menu';
  const params: any[] = [];
  const where: string[] = [];

  if (categories.length > 0) {
    where.push(`category IN (${categories.map(() => '?').join(',')})`);
    params.push(...categories);
  }
  if (search) {
    where.push('LOWER(title) LIKE ?');
    params.push(`%${search.toLowerCase()}%`);
  }
  if (where.length > 0) {
    query += ' WHERE ' + where.join(' AND ');
  }
  return await db.getAllAsync(query, params);
}

export async function clearMenuTable() {
  await db.execAsync('DELETE FROM menu');
  await db.execAsync('DROP TABLE menu')
} 