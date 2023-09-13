const pool = require('./pool')

const getRatezone = async (req, res) => {
    const { dpt } = req.params
    try {
        const ratezone = await getRatezoneByDept(dpt)
        res.status(200).json(ratezone)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

const getDeptsName = async (req, res) => {
    try {
        const allDeptsName = await getAllDeptsName()
        res.status(200).json(allDeptsName)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

const getRatezoneByDept = async (dpt) => {
    const [rows] = await pool.query(`
        SELECT * FROM rate_zone 
        WHERE departement = ?
        `, [dpt])
    return rows
}

const getAllDeptsName = async (dpt) => {
    const [rows] = await pool.query(`
        SELECT DISTINCT dept_name 
        FROM rate_zone`)
    return rows
}

module.exports = {
    getRatezone,
    getDeptsName
}