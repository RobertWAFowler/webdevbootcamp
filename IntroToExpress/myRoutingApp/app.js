const express = require("express");
const app = express();

app.listen(3000, function() {
    console.log('Server listening on port 3000');
});

app.get("/", function(req,res){
    res.send("Hi there, welcome to my assignment");
});

app.get("/speak/:animal", function(req,res){
   let animal = req.params.animal;

   if (animal === "pig") {
       res.send("Oink");
   } else if (animal === "cow") {
       res.send("Moo");
   } else if (animal === "dog") {
       res.send("Woof Woof");
   } else {
       res.redirect("/speak");
   }
});

app.get("/repeat/:word/:count", function(req,res){
   let word = req.params.word;
   let count = req.params.count;
   res.send((word+" ").repeat(count));
});


app.get("*", function(req,res){
    res.send("Sorry, page not found... What are you doing with your life?");
});
