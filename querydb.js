const db = require('./connection');

function queryDatabase (sql) {
    return new Promise ( (resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) return reject(err);
            return resolve(result);
        })
    })
}

module.exports = queryDatabase