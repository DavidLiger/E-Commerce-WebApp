const pool = require('./pool')

const findRateByDevice = async (req, res) => {
    const { id } = req.body
    try {
        const rate = await getRateByDevice(id)
        res.status(200).json(rate)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

const getRemoteRate = async (req, res) => {
    try {
        const rate = await getRemoteRatePrice()
        res.status(200).json(rate)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

const findSubcategoryByDevice = async (req, res) => {
    const { device_id } = req.body
    try {
        const rate = await getSubcategoryByDevice(device_id)
        res.status(200).json(rate)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

const getRateByDevice = async (id) => {
    const [rows] = await pool.query(`
        SELECT * FROM rates 
        WHERE id = ?
        `, [id])
    return rows[0]
}

const getRemoteRatePrice = async () => {
    const [rows] = await pool.query(`
        SELECT * FROM rates 
        WHERE intervention_type = 'remote'
        `)
    return rows[0]
}

const getSubcategoryByDevice = async (device_id) => {
    const [rows] = await pool.query(`
        SELECT * FROM rates 
        WHERE device_id = ?
        `, [device_id])
    return rows
}

module.exports = {
    findRateByDevice,
    getRemoteRate,
    findSubcategoryByDevice
}