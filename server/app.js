const express = require('express')
const app = express()  
const article = require('./routes/article')
const bodyParser = require('body-parser')
const user = require('./routes/user')
const repairfile = require('./routes/repairfile')
const devices = require('./routes/devices')
const brands = require('./routes/brands')
const agencies = require('./routes/agencies')
const rates = require('./routes/rates')
const advices = require('./routes/advices')
const ratezone = require('./routes/ratezone')
const manageImg = require('./routes/manageImg')
const manageBlogImg = require('./routes/manageBlogImg')
const getImg = require('./routes/getImg')
const getBlogImg = require('./routes/getBlogImg')
const {
    uploadImg
} = require('./controllers/manageImg')
const {
    uploadBlogImg
} = require('./controllers/manageBlogImg')
const transferFile = require('./routes/transferFile')
const updateFile = require('./routes/updateFile')
const confirmationMail = require('./routes/confirmationMail')
const remoteDiagPlanning = require('./routes/remoteDiagPlanning')
const phoneDateFile = require('./routes/phoneDateFile')
//getArticle
const getArticles = require('./routes/getArticles')

const rawParser = bodyParser.raw({type: ["image/jpeg", "image/png", "image/jpg"], limit: "15mb"})
// static assets
app.use(express.static('./methods-public'))
// parse form data
app.use(express.urlencoded({extended: false}))
// parse json
app.use(express.json())
// use router
app.use('/api/v1/article', article)
app.use('/api/v1/repairfile', repairfile)
app.use('/api/v1/user', user)
app.use('/api/v1/devices', devices)
app.use('/api/v1/brands', brands)
app.use('/api/v1/agencies', agencies)
app.use('/api/v1/rates', rates)
app.use('/api/v1/advices', advices)
app.use('/api/v1/ratezone', ratezone)
app.post('/api/v1/uploadImg/:name', rawParser, uploadImg)
app.post('/api/v1/uploadBlogImg/:name', rawParser, uploadBlogImg)
app.use('/api/v1/manageImg', manageImg)
app.use('/api/v1/getImg', getImg)
app.use('/api/v1/getBlogImg', getBlogImg)
app.use('/api/v1/transferFile', transferFile)
app.use('/api/v1/updateFile', updateFile)
app.use('/api/v1/confirmationMail', confirmationMail)
app.use('/api/v1/remoteDiagPlanning', remoteDiagPlanning)
app.use('/api/v1/phoneDateFile', phoneDateFile)
app.use('/api/v1/getArticles', getArticles)
app.use('/api/v1/manageBlogImg', manageBlogImg)

// TODO : garbage collector imgs dans /temp
app.get('/', (req, res) => res.send('Hello World! from Node.js'))
app.listen(5000, ()=>{
    console.log('Server is listening on port 5000...');
})