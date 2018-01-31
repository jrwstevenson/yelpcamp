var express     = require("express");
var router      = express.Router();
var passport    = require("passport");
var User        = require("../models/user");

//Root Route
router.get("/", function(req, res){
    res.render("landing");
});


// Register ==================================================
//Show registration Form
router.get("/register", function(req, res){
   res.render("register", {page: 'register'}); 
});

//Sign Up Logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        } 
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

//Login ====================================================
//Login Form
router.get("/login", function(req, res){
   res.render("login", {page: 'login'}); 
});

//Login Logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res){
    
});

//Logout==================================================
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "You have been logged out!");
    res.redirect("/campgrounds");
});



module.exports = router;