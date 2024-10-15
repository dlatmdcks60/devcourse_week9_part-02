const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const allCategory = (req, res) => {
    let sql = 'SELECT * FROM books';
    conn.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        return res.status(StatusCodes.OK).json(rows);
    });
};

module.exports = {
    allCategory,
};
