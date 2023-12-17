const express = require('express')
const app = express()
const ejs = require('ejs')
const mongoose = require('mongoose')
const expressSession = require('express-session')
const flash = require('connect-flash')
const path = require('path')

//อัพโหลดรูป (สำหรับ POST เท่านั้น)
const fileUpload = require('express-fileupload');
app.use(fileUpload());
//const multer = require('multer');
//const fs = require('fs');

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
const order_listController = require('./controllers/order_listController')
const prod_infoController = require('./controllers/prod_infoController')
const purchasesController = require('./controllers/purchasesController')
const shop_cartController = require('./controllers/shop_cartController')
const shopbrowserController = require('./controllers/shopbrowserController')
const userprofileController = require('./controllers/userprofileController')

const mockinputController = require('./controllers/mockinputController')
const mockinputUploadController = require('./controllers/mockinputUploadController')

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
app.get('/order_list', authMiddleware, order_listController)
app.get('/prod_info', prod_infoController)
app.get('/purchases',authMiddleware, purchasesController)
app.get('/shop_cart',authMiddleware, shop_cartController)
app.get('/shopbrowser', shopbrowserController)
app.get('/userprofile', authMiddleware, userprofileController)
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

//อัพโหลดรูป POST
app.get('/mockinput', mockinputController)
app.post('/upload', mockinputUploadController);

// const storage = multer.memoryStorage(); // Store the file in memory
// const upload = multer({ storage: storage });
// const imageBuffer = fs.readFileSync('./anis.png');
// console.log(imageBuffer)

// app.post('/upload', upload.single('image'), async (req, res) => {
//     try {
//       const newImage = new Image({
//         data: req.file.buffer,
//         contentType: req.file.mimetype,
//       });
  
//       await newImage.save();
  
//       res.status(201).send('Image uploaded successfully');
//     } catch (error) {
//       console.error(error);
//       res.status(500).send('Internal Server Error');
//     }
//   });

const PORT = process.ENV || 5000;



app.listen(PORT, () => console.log(`sever running on port ${PORT}`));