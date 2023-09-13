const pool = require('./pool')
const bcrypt = require('bcrypt')
const crypto = require("crypto")
const validator = require('validator')
const jwt = require('jsonwebtoken')
const mailer = require('../utils/mailer')

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '3d'})
}

const loginUser = async (req, res) => {
    const {email, password} = req.body
    try {
        const user = await login(email, password)
        const token = createToken(user._id)
        // const firstName = user.first_name
        res.status(200).json({email, token, user})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

const signupUser = async (req, res) => {
    const {email, password, firstName, lastName, adress, zipcode, cityName, cityGeoLoc, phoneNumber} = req.body
    try {
        await signIn(email, password, firstName, lastName, adress, zipcode, cityName, cityGeoLoc, phoneNumber)
        res.status(200).json({success: 'Un lien d\'activation a été envoyé dans votre boite mail'})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

const verifyUser = async (req, res) => {
    const { id, token } = req.body
    try {
        const user = await verify(id, token)
        res.status(200).json(user)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

const renewPassword = async (req, res) => {
    const {email} = req.body
    try {
        await sendMailToUpdatePassword(email)
        res.status(200).json({success: 'Un lien de changement de mot de passe a été envoyé dans votre boite mail'})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

const changePassword = async (req, res) => {
    const { id, token, password, confirmPassword } = req.body
    try {
        await updatePassword(id, token, password, confirmPassword)
        res.status(200).json({success: true})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

const verify = async (id, token) => {
    var user = await getUserBy_Id(id)
    const userToken = user.activation_token
    if(user && userToken != token){
        throw Error('Lien d\'activation expiré')
    }else{
        const newActivToken = crypto.randomBytes(32).toString('hex');
        await pool.query(`
            UPDATE users
            SET activation_token = ?, verified = 1
            WHERE _id = ?`,
            [newActivToken, id])
        user = await getUserBy_Id(id)
        return user
    }
}

const sendMailToUpdatePassword = async function (email) {
    if(!validator.isEmail(email)){
        throw Error('Email is not valid')
    }
    const user = await getUserByEmail(email)
    if(!user){
        throw Error('Pas de compte associé à cet email')
    }else{
        const newActivToken = crypto.randomBytes(32).toString('hex');
        await pool.query(`
            UPDATE users
            SET activation_token = ?
            WHERE _id = ?`,
            [newActivToken, user._id])
        try {
            await mailer(email, "Change Password", `${process.env.BASE_URL}forgot-password?id=${user._id}&token=${newActivToken}` )
        } catch (error) {
            console.log(error);
        }
    }
}

const updatePassword = async function (id, token, password, confirmPassword) {
    if(password != confirmPassword){
        throw Error('Les mots de passe ne correspondent pas !')
    }
    if(!validator.isStrongPassword(password)){
        throw Error('Mot de passe trop simple (min: 8 caractères, min: 1 majuscule, min: 1 minuscule, min: 1 chiffre, min: 1 caractère spécial)')
    }
    const user = await getUserBy_Id(id)
    if(!user){
        throw Error('Pas de compte associé à cet email')
    }
    if(user.activation_token != token){
        throw Error('Lien de changement de mot de passe expiré')
    }else{
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        const newActivToken = crypto.randomBytes(32).toString('hex');
        await pool.query(`
            UPDATE users
            SET password = ?, activation_token = ?
            WHERE _id = ?
            `,[hash, newActivToken, user._id])
    }
}

const signIn = async function (email, password, firstName, lastName, adress, zipcode, cityName, cityGeoLoc, phoneNumber) {

    // validation
    if(!email || !password || !firstName || !lastName || !adress || !zipcode || !cityName || !cityGeoLoc || !phoneNumber){
        throw Error('Merci de remplir tous les champs')
    }
    if(!validator.isEmail(email)){
        throw Error('Email invalide')
    }
    if(!validator.isStrongPassword(password)){
        throw Error('Mot de passe trop simple (min: 8 caractères, min: 1 majuscule, min: 1 minuscule, min: 1 chiffre, min: 1 caractère spécial)')
    }
    //control if user already exists
    const user = await getUserByEmail(email)
    if(user){
        throw Error('Email déjà utilisé')
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const _id = crypto.randomBytes(12).toString('hex');
    const token = crypto.randomBytes(32).toString('hex');
    const message = `Afin de ne pas perdre les données de votre 
                    dossier en cours merci de cliquer sur le lien 
                    ci-dessous depuis le navigateur (ou l'application) 
                    dans lequel vous avez commencer votre dossier :`
    // insere en BDD et recupère * (id..)
    await pool.query(`
        INSERT INTO users (email, password, first_name, last_name, adress, 
        zipcode, city_name, city_geoLoc, phone_number, _id, activation_token, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [email, hash, firstName, lastName, adress, zipcode, cityName, cityGeoLoc, phoneNumber, _id, token, new Date()])
    // const user = {email, password: hash, _id: _id}
    try {
        await mailer(email, "Verify Email", `${message} ${process.env.BASE_URL}verify-account?id=${_id}&token=${token}` )
    } catch (error) {
        console.log(error);
    }
    
    
}

const login = async function (email, password) {
    if(!email || !password){
        throw Error('All fields must be filled')
    }
    //control if user already exists
    const user = await getUserByEmail(email)
    if(!user){
        throw Error('Incorrect email')
    }
    const match = await bcrypt.compare(password, user.password)
    if(!match){
        throw Error('Incorrect password')
    }
    if(!user.verified){
        throw Error('Compte non activé ! Cliquez sur le lien envoyé dans votre boite mail')
    }
    return user
    
}

const getUserBy_Id = async (id) => {
    const [rows] = await pool.query(`
        SELECT * FROM users 
        WHERE _id = ?
        `, [id])
    return rows[0]
}

const getUserByEmail = async (email) => {
    const [rows] = await pool.query(`
        SELECT * FROM users 
        WHERE email = ?
            `, [email])
    return rows[0]
}

module.exports = { 
    signupUser, 
    loginUser, 
    verifyUser, 
    renewPassword, 
    changePassword ,
    getUserBy_Id
}