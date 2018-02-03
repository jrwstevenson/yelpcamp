var express     = require("express");
var router      = express.Router();
var passport    = require("passport");
var User        = require("../models/user");
var Campground  = require("../models/campgrounds");
var middleware = require("../middleware");

//INDEX - show all Users
router.get("/", function(req, res){
    // Get all Users from DB
    User.find({}, function(err, allUsers){
       if(err){
           console.log(err);
       } else {
          res.render("users/index",{users:allUsers});
       }
    });
});


// User Profiles
router.get("/:id", function(req, res) {
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            req.flash("error", "Something went wrong");
            res.redirect("/");
        }
        Campground.find().where("author.id").equals(foundUser._id).exec(function(err, campgrounds){
            if(err){
            req.flash("err", "Something went wrong");
            res.redirect("/");
            }
            res.render("users/show", {user: foundUser, campgrounds: campgrounds});
        });
    });
});

// EDIT USER ROUTE
router.get("/:id/edit", function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        res.render("users/edit", {user: foundUser});
    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", function(req, res){
    // find and update the correct User
    User.findByIdAndUpdate(req.params.id, req.body.user, function(err, updatedUser){
       if(err){
           res.redirect("/users");
       } else {
           //redirect somewhere(show page)
           res.redirect("/users/" + req.params.id);
       }
    });
});

module.exports = router;