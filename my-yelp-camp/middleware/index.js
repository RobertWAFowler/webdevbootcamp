const Campground = require("../models/campground"),
    Comment = require("../models/comment");

const middlewareObj = {};

// DESTROY CAMPGROUND ROUTE
middlewareObj.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");

    res.redirect("/login");
}

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, foundCampground) => {
            if (err) {
                console.log(err);
                eq.flash("error", "Campground not found");
                res.redirect("back");
            } else {
                if (foundCampground.author.id && foundCampground.author.id.equals(req.user._id)) {
                    console.log(foundCampground);
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                console.log(err);
                eq.flash("error", "Comment not found");
                res.redirect("back");
            } else {
                if (foundComment.author.id && foundComment.author.id.equals(req.user._id)) {
                    console.log(foundComment);
                    next();
                } else {
                    eq.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        eq.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

module.exports = middlewareObj;
