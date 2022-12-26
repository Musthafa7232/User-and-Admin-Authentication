const express = require('express');
const session = require('express-session');
const router = express.Router();

const [dbConnect] = require('../connect/mongodb')

router.use(session({
    secret:"secrete-key",
    resave: false ,
    saveUninitialized:true,
}))
//clear cache
router.use(function (req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
  });

router.get('/home', (req, res) => {
    if (req.session.user) {
        const data = req.session.data
        res.render('users/home', { data })
    }else if(req.session.admin) {
        res.redirect('/admin/home')
    }else {
        res.redirect('/');
    }
})
router.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/home')
    } else if(req.session.admin) {
        res.redirect('/admin/home')
    }else{
        if(req.session.loginErr!=""){
         const   loginErr=req.session.loginErr
            req.session.loginErr=""
            res.render('users/login', { loginErr });
        }else{
          const  loginErr=""
res.render('users/login', { loginErr})
        }
        
    }
})
router.post('/', async (req, res) => {
    let data = await dbConnect();
    data = await data.find({ email:req.body.email }).toArray();
    if (data.length == 0) {
        req.session.loginErr = "invalid user";
        res.redirect("/");
    } else if(req.body.password!=data[0].password){
        req.session.loginErr = "Incorrect Password"
        res.redirect('/');
    }else {
        req.session.data = data;
        req.session.user = true;
        res.redirect('/home');
    }
})
router.get('/signup', (req, res) => {
    if (req.session.user) {
        res.redirect('/home')
    } else if(req.session.admin) {
        res.redirect('/admin/home')
    }else {
        if(req.session.message!=""){
            const message = req.session.message;
        req.session.message=""
        res.render('users/signup', { message });
        }else{
           const  message=""
        res.render('users/signup', { message } )
        }
        
    }
})
router.post('/signup', async (req, res) => {
   
        let data = await dbConnect();
        let user = await dbConnect();
        user = await user.find({ email: req.body.email }).toArray();
        if (user.length == 0) {
            data = await data.insertOne({ email: req.body.email, name: req.body.username, password: req.body.password })
            res.redirect('/');
        }
        else {
             req.session.message = "you have  entered a existing email"
            res.redirect('/signup')
        }
    }
)
router.get('/logout', (req, res) => {
    if(req.session.admin){
        res.redirect('/admin')  
    }else{
      req.session.destroy()
    res.redirect('/')  
    }
})

module.exports = router;
