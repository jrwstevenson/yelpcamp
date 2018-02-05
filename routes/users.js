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


// User Profiles SHOW
router.get("/:id", function(req, res) {
    User.findById(req.params.id, function(err, foundUser){
        if(err || !foundUser){
            req.flash("error", "That user doens't exist");
            res.redirect("/users");
            return;
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
router.get("/:id/edit", middleware.checkUserOwnership, function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        res.render("users/edit", {user: foundUser});
    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkUserOwnership, function(req, res){
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

// DESTROY CAMPGROUND ROUTE
router.delete("/:id",middleware.checkUserOwnership, function(req, res){
   User.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/users");
      } else {
          res.redirect("/users");
      }
   });
});

module.exports = router;