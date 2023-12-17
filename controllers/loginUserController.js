const bcrypt = require('bcrypt')
const User = require('../models/User')


module.exports = (req, res) =>{
    const {username, email, password} = req.body

    User.findOne({username: username}).then((user) =>{
        console.log(user)

        if (user) {
            let cmp = bcrypt.compare(password, user.password).then((match) =>{
                if (match){
                    req.session.userId = user._id
                    //redirect ไปเว็บไหนก็ได้ไม่จำเป็นจะต้องเป็นเว็บเรา
                    res.redirect('/home')
                } else {
                    res.redirect('/login')
                }
            })
        } else {
            res.redirect('/login')
        }
    })
}