const express = require('express'),
    router = express.Router(),
    Campground = require("../models/campground"),
    middleware = require("../middleware");


router.get("/", (req, res) => {
    Campground.find({}, (err, allCamprounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCamprounds});
        }
    })
});

router.post("/", middleware.isLoggedIn, (req, res) => {
    const name = req.body.name;
    const image = req.body.image;
    const price = req.body.price;
    const description = req.body.description;

    const author = {
        id: req.user._id,
        username: req.user.username
    };

    const newCampGround = {
        "name": name,
        "image": image,
        "price": price,
        "description": description,
        "author": author
    };

    Campground.create(newCampGround, (err, newCampGround) => {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            // get data from form and add to campgrounds array
            // redirect back to campgrounds page
            console.log(newCampGround);
            res.redirect("/");
        }
    });
});

router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

router.get("/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
                console.log(foundCampground);
                res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            console.log(updatedCampground);
            res.redirect(`/campgrounds/${req.params.id}`)
        }
    });
});

router.delete("/:id",  middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;
