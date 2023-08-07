const jwt = require('jsonwebtoken')
const { getUserBy_Id } = require('../controllers/user')

const requireAuth = async (req, res, next) => {
    //verify authentication
    const { authorization } = req.headers
    if(!authorization) {
        return res.status(401).json({error: 'Authorization token required'})
    }

    const token = authorization.split(' ')[1]

    try {
        const { _id } = jwt.verify(token, process.env.SECRET)
        // add the user to the request, now it can be access in the next function 
        // (after HTTP Verb in routes) e.g = in createArticle(), in getArticles()
        req.user = await getUserBy_Id(_id)
        next()
    } catch (error) {
        console.log(error);
        res.status(401).json({error: 'Request is not authorized'})
    }
}

module.exports = requireAuth