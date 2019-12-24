const pool = require('../modules/db/pool');
const table = 'card';

module.exports = {
    read: async (cardIdx) => {
        const query = `SELECT * FROM ${table} WHERE cardIdx = ${cardIdx}`;
        const values = [cardIdx];
        const result = await pool.queryParam_Parse(query, values);
        return result[0];
    },
    readAll: async () => {
        const query = `SELECT * FROM ${table}`;
        const result = await pool.queryParam_None(query);
        return result;
    },
    create: async ({title, content, record, visible}, image, userIdx) => {
        const fields = 'title, content, image, record, visible, userIdx';
        const questions = `?, ?, ?, ?, ?, ?`;
        const query = `INSERT INTO ${table}(${fields}) VALUES(${questions})`;
        const values = [title, content, image, record, visible, userIdx];
        const result = await pool.queryParam_Parse(query, values);
        const card = cardData(result[0]);
        console.log('card', card);
        return card;
        //return result;
    },
};