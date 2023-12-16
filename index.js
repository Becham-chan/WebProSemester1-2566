const express = require('express')
const app = express()
const ejs = require('ejs')
const mongoose = require('mongoose')
const expressSession = require('express-session')
const flash = require('connect-flash')
const path = require('path')

//ต่อ mongoDB

mongoose.connect('mongodb+srv://admin:1234@cluster1234.miityi3.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser:true
})

global.loggedIn = null

//controllers
const indexController = require('./controllers/indexController')
const loginController = require('./controllers/loginController')
const registerController = require('./controllers/registerController')
const storeUserController = require('./controllers/storeUserController')
const loginUserController = require('./controllers/loginUserController')
const logoutController = require('./controllers/logoutController')
const homeController = require('./controllers/homeController')

//Middleware
const redirectIfAuth = require('./middleware/redirectIfAuth')
const authMiddleware = require('./middleware/authMiddleware')


app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded())
app.use(flash())
app.use(expressSession({
    secret: "node secret"
}))
app.use("*", (req, res, next) =>{
    loggedIn = req.session.userId
    next()
})
app.set('view engine', 'ejs')



app.get('/', indexController)
//middleware คั่นไว้เพื่อไม่ให้สามารถไปหน้า login ได้หลังจาก login แล้ว
app.get('/login', redirectIfAuth, loginController)
app.get('/home', authMiddleware, homeController)
app.get('/register', redirectIfAuth, registerController)
app.post('/user/register', redirectIfAuth, storeUserController)
app.post('/user/login', redirectIfAuth, loginUserController)


app.get('/logout', logoutController)


// app.get('/', (req, res) =>{
//     res.sendFile(path.join(__dirname, 'public','midTest01.html'));
// })


/*
const users = [
    {
        id: 1,
        name: "Misha",
        email: "Misha@gmail.com"
    },
    {
        id: 2,
        name: "Kotori",
        email: "Kotori@gmail.com"
    },
    {
        id: 3,
        name: "Koneko",
        email: "Koneko@gmail.com"
    }
]
*/

//get api all user เปลี่ยนเป็น data ใน mongo ได้
//app.get('/api/users', (req, res) => res.json(users));

//set static folder
//app.use(express.static(path.join(__dirname, 'public')));


const PORT = process.ENV || 5000;


app.listen(PORT, () => console.log(`sever running on port ${PORT}`));