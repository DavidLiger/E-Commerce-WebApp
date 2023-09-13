const pool = require('./pool')

// TODO = remplacer article_login par article_pass après avoir trouver la clé
// de hash dans le code WordPress

const getBrands = async (req, res) => {
    // const {email, login} = req.body
    const [rows] = await pool.query(`
        SELECT nomMarque FROM marques
        `)
    res.status(201).send(rows)
}

module.exports = {
    getBrands
}