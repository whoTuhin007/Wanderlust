

if(process.env.NODE_ENV != 'production'){
  require('dotenv').config()
  

}

const mongoose = require('mongoose');
const express = require('express');
const MongoStore = require('connect-mongo');
const app = express();
const session = require('express-session');
// const Listing = require('./models/listing');

// const Review = require('./models/review');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');


const port = 8080;
const mongoUrl = 'mongodb://127.0.0.1:27017/wanderlust';
const dbUrl = process.env.MONGO_URL;
// const wrapAsync = require('./utils/wrapAsync')
const ExpressError = require('./utils/expressErr');
// const { listingSchema, reviewSchema } = require('./schema');
const expressRouter = require('./routes/listing.js');
const expressRouter1 = require('./routes/reviews.js');
const expressRouter2 = require('./routes/user.js');
const flash= require('connect-flash')
const passport = require('passport');
const LocalStrategy= require('passport-local');
const User= require('./models/user.js');
const { MongoClient } = require('mongodb');

async function connect() {
    try {
        const client = new MongoClient(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        console.log("Connected to MongoDB successfully!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

connect();


const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto:{
    secret : process.env.SECRET,
    touchAfter: 24*3600,
  }
});
store.on('error',(err)=>{
  console.log(err,'error in mongo session')
})
const sessionOptions= {
  store,
  secret : process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires: Date.now() + 10*24*60*60*1000,
    maxAge:10*24*60*60*1000,
    httpOnly:true,
  }
};

app.use(express.urlencoded({ extended: true }));
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req,res,next)=>{
  res.locals.success= req.flash('success');
  res.locals.error= req.flash('error');
  res.locals.currUser = req.user;
 
  next();
})
app.use('/', expressRouter2);





app.engine('ejs', ejsMate);
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, '/public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use('/listing', expressRouter);
app.use('/listing/:id/reviews', expressRouter1);





async function main() {
  await mongoose.connect(dbUrl);
}

main().then(() => { console.log('connected') }).catch((err) => { console.log(err) });




//Root Route
// app.get('/', (req, res) => {
//   res.send('hi i am root');
// });



//error handler
app.all('*', (req, res, next) => {
  next(new ExpressError(404, 'page not found'));

})


app.use((err, req, res, next) => {
  let { statusCode = 500, message = 'something went wrong' } = err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render('error.ejs', { err });


});
app.listen(port, () => { console.log('listening') });




