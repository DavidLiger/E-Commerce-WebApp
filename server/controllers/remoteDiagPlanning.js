const pool = require('./pool')

const getRemoteDiagPlanning = async (req, res) => {
    const { date } = req.body
    try {
        const planning = await getRemoteDiagPlanningByDate(date)
        res.status(200).json(planning)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

const getDiagsByMonth = async (req, res) => {
    const { month } = req.params
    const { year } = req.params
    try {
        const diags = await getRemoteDiagsByMonth(month, year)
        res.status(200).json(diags)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

const getRemoteDiagPlanningByDate = async (date) => {
    const [rows] = await pool.query(`
        SELECT * FROM remote_diag_planning 
        WHERE phone_appointment = ?
        `, [date])
    return rows
}

const getRemoteDiagsByMonth = async (month, year) => {
    const [rows] = await pool.query(`
        SELECT * FROM remote_diag_planning 
        WHERE phone_appointment LIKE '%${month}/${year}%'
        `)
    return rows
}

module.exports = {
    getRemoteDiagPlanning,
    getDiagsByMonth
}