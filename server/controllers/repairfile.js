const pool = require('./pool')

// TODO = remplacer article_login par article_pass après avoir trouver la clé
// de hash dans le code WordPress

const getRepairFile = async (req, res) => {
    const { id } = req.params
    try {
        const rate = await getRepairFileById(id)
        res.status(200).json(rate)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

const getRepairFiles = async (req, res) => {
    try {
        const files = await getRepairFilesIds()
        res.status(200).json(files)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

const getRepairFilesById = async (req, res) => {
    const { id } = req.params
    try {
        const files = await getRepairFilesIdsById(id)
        res.status(200).json(files)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

const updateRepairFile = async (req, res) => {
    const { id } = req.params
    const { erp_file_id } = req.body
    try {
        await updateRepairFileById(id, erp_file_id).then(()=> {
            res.status(200).json({success: true})
        })
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

const createRepairFile = async (req, res) => {
    const {
        device, 
        category, 
        selectedOffer, 
        issue, 
        articleCode,
        serialNumber, 
        comment, 
        phoneAppointment, 
        selectedTimeSlotRef, 
        brand, 
        zipCode, 
        cityId, 
        cities, 
        nearestAgency,
        ratezone,
        price,
        photoFile
    } = req.body
    const user_id = req.user._id
    const city = cities[cityId].name
    const [result] = await pool.query(`
        INSERT INTO repair_file (
            user_id, 
            device_id, 
            category, 
            rates_id, 
            issue_id,
            serial_number, 
            comment, 
            brand,
            zipcode,
            city,
            agency_id,
            rate_zone,
            price,
            photo_files,
            created_at
            )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            user_id, 
            device.id, 
            category, 
            selectedOffer.id, 
            issue.id,
            serialNumber, 
            comment, 
            brand, 
            zipCode,
            city,
            nearestAgency.id,
            ratezone,
            price,
            photoFile.toString(),
            new Date()])
    if(!result.insertId){
        return res
        .status(201)
        .json({success: false, error: 'Something went wrong !'})
    }
    if(phoneAppointment){
        const [planning] = await pool.query(`
        INSERT INTO remote_diag_planning (
            repair_file_id, 
            phone_appointment,
            time_slot,
            created_at
            )
        VALUES (?, ?, ?, ?)
        `, [
            result.insertId, 
            phoneAppointment,
            selectedTimeSlotRef.hour,
            new Date()])
    }
    const repairFileInserted = await getRepairFileById(result.insertId)
    res.status(201).json({success: true, ...repairFileInserted})
}

const getRepairFileById = async (id) => {
    const [rows] = await pool.query(`
        SELECT rf.id , u.first_name , u.last_name , u.adress , 
        u.zipcode , u.city_name , u.email , u.phone_number ,
        d.name , a.issue , rf.brand , rf.serial_number ,
        rf.comment , r.intervention_type , r.subcategory, ag.name AS agency, 
        rdp.phone_appointment , rdp.time_slot , rf.photo_files, rf.price
        FROM repair_file rf
        INNER JOIN users u ON rf.user_id = u._id
        INNER JOIN devices d ON d.id  = rf.device_id 
        INNER JOIN advices a ON a.id  = rf.issue_id 
        INNER JOIN rates r ON r.id = rf.rates_id 
        INNER JOIN agencies ag ON ag.id = rf.agency_id 
        INNER JOIN remote_diag_planning rdp ON rdp.repair_file_id = rf.id 
        WHERE rf.id = ?
        `, [id])
    return rows[0]
}

const getRepairFilesIds = async () => {
    const [rows] = await pool.query(`
        SELECT rf.id, u.first_name, u.last_name , rdp.phone_appointment
        FROM repair_file rf 
        INNER JOIN users u ON rf.user_id = u._id 
        INNER JOIN remote_diag_planning rdp ON rdp.repair_file_id = rf.id
        ORDER BY rf.id
        `)
    return rows
}

const getRepairFilesIdsById = async (id) => {
    const [rows] = await pool.query(`
        SELECT rf.id, u.first_name, u.last_name , rdp.phone_appointment
        FROM repair_file rf 
        INNER JOIN users u ON rf.user_id = u._id 
        INNER JOIN remote_diag_planning rdp ON rdp.repair_file_id = rf.id
        WHERE rf.id = ?
        ORDER BY rf.id
        `, [id])
    return rows
}

const updateRepairFileById = async (id, erp_file_id) => {
    const [result] = await pool.query(`
        UPDATE repair_file
        SET erp_file_id = ?
        WHERE id = ?
        `, [erp_file_id, id])
    if(!result.insertId){
        return res
        .status(201)
        .json({success: false, error: 'Something went wrong !'})
    }
    console.log(result);
    const repairFileInserted = await getRepairFileById(result.insertId)
    res.status(201).json({success: true, ...repairFileInserted})
}

module.exports = {
    getRepairFile,
    getRepairFiles,
    createRepairFile,
    updateRepairFile,
    getRepairFilesById
}