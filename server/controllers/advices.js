const pool = require('./pool')

const getAdvices = async (req, res) => {
    const { id } = req.params
    try {
        const rate = await getAdvicesById(id)
        res.status(200).json(rate)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

const getAdvicesById = async (id) => {
    const [rows] = await pool.query(`
        SELECT * FROM advices 
        WHERE device_id = ?
        `, [id])
    return rows
}

module.exports = {
    getAdvices
}