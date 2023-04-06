 //jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const  _ = require("lodash");
const mongoose = require ("mongoose");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
const db = "mongodb+srv://ishant06:ishant@cluster0.f9xompg.mongodb.net/blogs?retryWrites=true&w=majority"
mongoose.connect(db).then(()=>{
  console.log("mongoose connection sucessfull");
}).catch((err) => console.log(err));

const itemsSchema = {
    title : {
      type : String,
      require : true
    },
    blog :{
      type : String,
      require : true
    },
    value:{
      type : Number,
      require : true
    }
};

const user = mongoose.model("user" ,itemsSchema);


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

var posts = [];

app.get("/" , async function(req ,res){

  const item = await user.find({
                   value:0
               });
    console.log(item);
  
    item.forEach(function(v){
      if (posts.includes({
        title: v.title,
        text : v.blog
      })){
        console.log("occur");
        return
      } 
      else{ {posts.push({
            title : v.title,
            text : v.blog
           })} 
    }
  });




  res.render("home" , {
    home: homeStartingContent ,
    posts : posts 
  });
  
})

app.get("/contact" ,function(req, res){
  res.render("contact" , {
    contact : contactContent
  });
});


app.get("/about" , async function(req, res){
  res.render("about" , {
    about : aboutContent
  });
});

app.get("/compose" , function(req ,res){
  res.render("compose");
})

let arr = "";
app.post("/compose" , async function(req ,res){
  console.log(req.body);
  const titleb = req.body.title;
  const blogb = req.body.blog;
 try{
    var item1 =  await user.findOne({
      title : titleb
    }) 

    if(item1){
      console.log("Title Already Used");
      
    }else{
      item1 = await user.create({
        title : titleb,
        blog : blogb,
        value : 0
      });
      console.log("data added on users database");
    }   
  
  }catch(err){
    console.log(err);
  }
  res.redirect("/");
});




app.get("/posts/:topics" , function(req ,res){

  let param = _.lowerCase(req.params.topics);
  console.log(param);
  for(var i = 0 ; i<posts.length;i++){
   if(param === _.lowerCase(posts[i].title)){
     console.log("Match Found");
     res.render("post" , {
      title: posts[i].title ,
      text : posts[i].text 
    });
    
    }
  }
  res.render("home" , {
    home: homeStartingContent ,
    posts : posts 
  });
  
 
   
   
})





app.listen(3000, function() {
  console.log("Server started on port 3000");
});
