const pool = require('./pool')

// TODO = remplacer article_login par article_pass après avoir trouver la clé
// de hash dans le code WordPress

const getArticle = async (req, res) => {
    const {email, login} = req.body
    const [rows] = await pool.query(`
        SELECT * FROM articles 
        WHERE subject = ?
        AND title = ?
        `, [email, login])
    res.status(201).send(rows[0])
}

const getArticleById = async (id) => {
    const [rows] = await pool.query(`
        SELECT * FROM articles 
        WHERE id = ?
        `, [id])
    return rows[0]
}

// TEST : pour remontée paquet de données
const getArticles = async (req,res) => {
    const [rows] = await pool.query(`
        SELECT * FROM articles 
        ORDER BY id DESC
        `)
    res.status(201).send(rows)
}

// TODO = finir le CRUD avec database.js de Node MySQL App
const emptyFields = []

const createArticle = async (req, res) => {
    const {subject, title, text, photoName} = req.body
    console.log(req.body);
    const user_id = req.user._id
    emptyFields.splice(0, emptyFields.length);
    if(!subject){
        emptyFields.push('subject')
    }
    if(!title){
        emptyFields.push('title')
    }
    if(!text){
        emptyFields.push('text')
    }
    if(emptyFields.length > 0){
        return res
        .status(400)
        .json({success: false, error: 'Merci de remplir tous les champs', emptyFields})
    }
    const [result] = await pool.query(`
        INSERT INTO articles (subject, title, text, user_id, photo_files, createdAt)
        VALUES (?, ?, ?, ?, ?, ?)
        `, [subject, title, text, user_id, photoName, new Date()])
    if(!result.insertId){
        return res
        .status(201)
        .json({success: false, error: 'Something went wrong !'})
    }
    console.log(result);
    const articleInserted = await getArticleById(result.insertId)
    res.status(201).json({success: true, ...articleInserted})
}

const updateArticle = async (req, res) => {
    const {id, subject, title, text, photo} = req.body
    // console.log(req.body);
    await pool.query(`
        UPDATE articles
        SET subject = ?, title = ?, text = ?, photo_files = ?
        WHERE id = ?
        `, [subject, title, text, photo, id])
    const repairFileInserted = await getArticleById(id)
    res.status(201).json({success: true, ...repairFileInserted})
}

const deleteArticle = async (req, res) => {
    const { id } = req.params
    const [rows] = await pool.query(`
        SELECT * FROM articles 
        WHERE id = ?
        `, [id])
    // res.status(201).send(rows[0])
    if(!rows[0]){
        return res
        .status(404)
        .json({success: false, error: `no person with id ${req.params.id}`})
    }
    await pool.query(`
        DELETE FROM articles 
        WHERE id = ?
        `, [id])
    return res.status(200).json({success: true, id})
}

module.exports = {
    getArticle,
    getArticles,
    createArticle,
    updateArticle,
    deleteArticle
}