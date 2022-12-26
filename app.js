const express = require('express')
const ObjectId = require('mongodb').ObjectId
const [dbConnect, dbConnects] = require('./connect/mongodb')
const session = require('express-session')
const userrouter = require('./router/user')
const app = express()
//encoders
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
//static
app.use(express.static('public'))
//session 
app.use(session({
    secret: "hihello",
    resave: false,
    saveUninitialized: true,
}))
//clear cache
app.use(function (req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});
//view ejs
app.set('view engine', 'ejs')

//router
app.use('/', userrouter)



//admin
app.get('/admin/home', async (req, res) => {
    let users = await dbConnect();
    users = await users.find({}).toArray()
    if (req.session.admin) {
        res.render('admin/home', { users })
    } else if (req.session.user) {
        res.redirect('/home')
    } else {
        res.redirect('/admin')
    }
})
app.get('/admin', (req, res) => {
    if (req.session.admin) {
        res.redirect('/admin/home')
    } else if (req.session.user) {
        res.redirect('/home')
    } else { 
        if(req.session.message!=""){
        const message = req.session.message;
    req.session.message=""
    res.render('admin/login', { message });
    }else{
       const  message=""
    res.render('admin/login', { message } )
    }

       
    }

})

app.post('/admin', async (req, res) => {
    let data = await dbConnects();
    data = await data.find({ name: req.body.username }).toArray();
    if (data.length == 0) {
        req.session.message = "Invalid user";
        res.redirect('/admin')
    }else if(req.body.password!=data[0].password){
        req.session.message = "Incorrect Password"
        res.redirect('/admin');
    }else {
        req.session.admin = true;
        res.redirect('/admin/home',)
    }
})
app.get('/admin/edit/:id', async (req, res) => {
    if (req.session.admin) {
        var id = req.params.id
        let user = await dbConnect();
        user = await user.find({ _id: ObjectId(id) }).toArray();
        res.render('admin/edit', { user })
    } else if (req.session.user) {
        res.redirect('/home')
    } else {
        res.redirect('/admin')
    }
})
app.put('/admin/edit/:id', async (req, res) => {
    try {
      
        var id = req.params.id
        let data = await dbConnect();
        data = await data.updateOne({ _id: ObjectId(id) }, { $set: { name: req.body.name, email: req.body.email, password: req.body.password } })
        const user = " ";
        res.json({ redirect: '/admin' })
    }
    catch (error) {
        console.log(error)
    }


})
app.delete('/admin/edit/:id', async (req, res) => {
    var id = req.params.id
    let data = await dbConnect();
    try {
        data = await data.deleteOne({ _id: ObjectId(id) });
        res.json({ redirect: '/admin' })
       
    } catch (error) {
        console.log(error)
    }

})
app.post('/admin/searchuser', async (req, res) => {
    if (req.body.searchkey == 0) {
        res.redirect('/admin')
    } else {
        let users = await dbConnect();
        users = await users.find({ $or: [{ name: req.body.searchkey }, { email: req.body.searchkey }] }).toArray()
        if (users.length == 0) {
            res.render('admin/home', { users })
        } else {
            res.render('admin/home', { users })
            console.log(users)
        }
    }
})
app.get('/admin/adduser', (req, res) => {
    if (req.session.admin) {
        if(req.session.message!=""){
            const message = req.session.message;
        req.session.message=""
        res.render('admin/adduser', { message });
        }else{
           const  message=""
        res.render('admin/adduser', { message } )
        }
    } else if (req.session.user) {
        res.redirect('/home')
    } else {
        res.redirect('/admin')
    }
    
})

app.post('/admin/adduser', async (req, res) => {
    let data = await dbConnect();
    let user = await dbConnect();
    user = await user.find({ email: req.body.email }).toArray();
    if (user.length == 0) {
        data = await data.insertOne({ email: req.body.email, name: req.body.username, password: req.body.password })
        res.redirect('/admin');
    }
    else {
        req.session.message = "you have  entered a existing email"
        res.redirect('/admin/adduser',)
    }
   
})

app.get('/admin/logout', (req, res) => {
    if(req.session.user){
        res.redirect('/')  
    }else{
      req.session.destroy()
    res.redirect('/admin')  
    }
})
app.listen(3000, () => {
    console.log("port is running at 3000");
})