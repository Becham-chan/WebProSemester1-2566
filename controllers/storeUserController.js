const User = require('../models/User')

module.exports = (req, res) =>{
    //console.log(req.body)
    User.create(req.body).then(()=>{
        console.log("User registered successfully!")
        res.redirect('/')
    }).catch((error) =>{
        // console.log(error.errors)

        if (error) {
            const validationErrors =  Object.keys(error.errors).map(key => error.errors[key].message)

            //เก็บค่าบางอย่างเพื่อส่งไปแสดงในหน้าเว็บ
            req.flash('validationErrors', validationErrors)
            req.flash('data', req.body)
            return res.redirect('/register')

        }
        
    })
}