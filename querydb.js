const db = require('./connection');

function queryDatabase(sql, x) {
    return new Promise((resolve, reject) => {
    db.query(sql, x, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
}

module.exports = queryDatabase;
