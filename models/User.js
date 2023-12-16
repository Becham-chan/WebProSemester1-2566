const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')


const UserSchema = new Schema({
    email:{
        type: String,
        required: [true, 'Please provide email']
    },
    password:{
        type: String,
        required: [true, 'Please provide password']
    }
})

//encrypt password
UserSchema.pre('save', function(next) {
    const user = this

    //ยิ่งเลขเยอะยิ่งเข้ารหัสนานแต่ยิ่งปลอดภัย
    bcrypt.hash(user.password, 10).then(hash => {
        user.password = hash
        next()
    }).catch(error =>{
        console.error(error)
    })
})


const User = mongoose.model('User', UserSchema)
module.exports = User








