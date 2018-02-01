var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStratergy  = require("passport-local"),
    methodOverride  = require("method-override"),
    Campground      = require("./models/campgrounds"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDB          = require("./seeds"),
    geocoder        = require('geocoder');

//Requireing Routes    
var campgroundRoutes    = require("./routes/campgrounds"),
    commentRoutes       = require("./routes/comments"),
    indexRoutes         = require("./routes/index");
    
var dburl = process.env.DATABASEURL || "mongodb://localhost/yelp_camp_v11";
mongoose.connect(dburl);
//mongoose.connect("mongodb://james:yelpcamp@ds121088.mlab.com:21088/yelpcamp");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();


app.locals.moment = require("moment");

//Passport Config
app.use(require("express-session")({
    secret: "Princess Leia",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error")
    res.locals.success = req.flash("success")
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);


//==========================================================
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp V11 Started");
});



