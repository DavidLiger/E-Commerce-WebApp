const pool = require('./pool')

const getAgencies = async (req, res) => {
    const [rows] = await pool.query(`
        SELECT * FROM agencies
        `)
    res.status(201).send(rows)
}

module.exports = {
    getAgencies
}