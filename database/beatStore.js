const sqlite3 = require("sqlite3").verbose();

class BeatStore {
  constructor(dbPath = './beats.db') {
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Ошибка подключения к базе данных:', err);
      } else {
        console.log('Подключено к базе данных SQLite');
        this.initialize();
      }
    });
  }

  initialize() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS beats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fileId TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Ошибка при создании таблицы:', err);
        return;
      }
      this.db.run('ALTER TABLE beats ADD COLUMN title TEXT', (err) => {
        if (err && !err.message.includes('duplicate column')) {
          console.error('Ошибка при добавлении колонки title:', err);
        }
      });
      this.db.run('ALTER TABLE beats ADD COLUMN bpm INTEGER', (err) => {
        if (err && !err.message.includes('duplicate column')) {
          console.error('Ошибка при добавлении колонки bpm:', err);
        }
      });
      this.db.run('ALTER TABLE beats ADD COLUMN genres TEXT', (err) => {
        if (err && !err.message.includes('duplicate column')) {
          console.error('Ошибка при добавлении колонки genres:', err);
        }
      });
    });
  }

  async add(fileId, title = null, bpm = null, genres = null) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO beats (fileId, title, bpm, genres) VALUES (?, ?, ?, ?)',
        [fileId, title, bpm, genres ? JSON.stringify(genres) : null],
        function(err) {
          if (err) {
            console.error('Ошибка при добавлении бита в БД:', err);
            reject(err);
          } else {
            resolve(this.lastID);
          }
        }
      );
    });
  }

  async getLatest(limit = 10) {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM beats ORDER BY created_at DESC LIMIT ?', [limit], (err, rows) => {
        if (err) {
          console.error('Ошибка при получении последних битов:', err);
          reject(err);
        } else {
          resolve(rows.map(row => ({
            fileId: row.fileId,
            title: row.title,
            bpm: row.bpm,
            genres: row.genres ? JSON.parse(row.genres) : [],
          })));
        }
      });
    });
  }

  async getAll() {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM beats', (err, rows) => {
        if (err) {
          console.error('Ошибка при получении всех битов:', err);
          reject(err);
        } else {
          resolve(rows.map(row => ({
            fileId: row.fileId,
            title: row.title,
            bpm: row.bpm,
            genres: row.genres ? JSON.parse(row.genres) : [],
          })));
        }
      });
    });
  }

  async close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          console.error('Ошибка при закрытии БД:', err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

module.exports = BeatStore;