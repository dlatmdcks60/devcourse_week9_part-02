const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const allBooks = (req, res) => {
    let { category_id, news, limit, currentPage } = req.query;

    let offset = limit * (currentPage - 1);

    let sql = 'SELECT *, (SELECT count(*) FROM likes WHERE liked_book_id = books.id) AS likes FROM books';
    let value = [];
    if (category_id && news) {
        sql += ` WHERE category_id=? AND pub_date BETWEEN DATE_SUB(NOW(), INTERBAL 1 MONTH) AND NOW()`;
        value = [category_id];
    } else if (category_id) {
        sql += ` WHERE category_id=?`;
        value = [category_id];
    } else if (news) {
        sql += ` WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERBAL 1 MONTH) AND NOW()`;
    }

    sql += ` LIMIT ? OFFSET ?`
    value.push(parseInt(limit), offset);

    conn.query(sql, value, (err, rows) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        if (rows.length) {
            return res.status(StatusCodes.OK).json(rows);
        } else {
            return res.status(StatusCodes.NOT_FOUND).end();
        }
    });
};

const bookDetail = (req, res) => {
    let { user_id } = req.body;
    let book_id = req.params.id;

    let sql = `
            SELECT *,
                (SELECT count(*) FROM likes WHERE liked_book_id = books.id) AS likes,
                (SELECT EXISTS (SELECT * FROM likes WHERE user_id = ? AND liked_book_id = ?)) AS liked
            FROM books
            LEFT JOIN category
            ON books.category.id = category.category_id
            WHERE books.id = ?;`;
    let values = [user_id, book_id, book_id];
    conn.query(sql, values, (err, rows) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        if (rows[0]) {
            return res.status(StatusCodes.OK).json(rows);
        } else {
            return res.status(StatusCodes.NOT_FOUND).end();
        }
    });
};

// const booksByCategory = (req, res) => {
// };

module.exports = {
    allBooks,
    bookDetail,
};
