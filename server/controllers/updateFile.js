const pool = require('./pool')

const updateFile = async (req, res) => {
    const { id, erp_file_id } = req.body
    try {
        const result = await updateRepairFileById(id, erp_file_id)
        res.status(200).json({success: true, result})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

const getRepairFileById = async (id) => {
    const [rows] = await pool.query(`
        SELECT rf.id , rf.erp_file_id
        FROM repair_file rf
        WHERE rf.id = ?
        `, [id])
    return rows[0]
}

const updateRepairFileById = async (id, erp_file_id) => {
    const [result] = await pool.query(`
        UPDATE repair_file
        SET erp_file_id = ?
        WHERE id = ?
        `, [erp_file_id, id])
    if(result){
        const repairFileInserted = await getRepairFileById(id)
        return repairFileInserted
    }
}

module.exports = {
    updateFile
}