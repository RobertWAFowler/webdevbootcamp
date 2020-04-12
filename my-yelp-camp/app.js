const bodyParser = require("body-parser"),
    mongoose = require('mongoose'),
    flash = require('connect-flash'),
    passport = require('passport'),
    User = require('./models/user'),
    LocalStrategy = require('passport-local'),
    express = require("express"),
    app = express(),
    port = 8080,
    seedDB = require("./seeds"),
    methodOverride = require('method-override');

const commentRoutes = require("./routes/comments"),
    camgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require('./routes/index');

mongoose.connect("mongodb://root:example@localhost:27017/yelp_camp?authSource=admin", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "once again Rusty wins custes dog!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.errorMessage = req.flash("error");
    res.locals.successMessage = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/campgrounds", camgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// Listener
app.listen(port, () => {
    console.log("my-yelp-camp server has started!!!");
})
