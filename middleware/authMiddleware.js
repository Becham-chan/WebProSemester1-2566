const User = require('../models/User')

module.exports = (req, res, next) =>{
    User.findById(req.session.userId).then((user) =>{
        if (!user) {
            return res.redirect('https://www.youtube.com/watch?v=iaALsfUtVS8')
        }

        console.log('User logged in successfully')
        next()

    }).catch( error =>{
        console.error(error)
    })
}