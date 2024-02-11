const express = require("express");
const mongoClient = require("mongodb").MongoClient;
const cors = require("cors");
const { expr } = require("jquery");


const conString = "mongodb://127.0.0.1:27017";

const app = express();
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());


app.get("/getusers",(request,response)=>{
    mongoClient.connect(conString)
    .then(clientObject =>{
      var database = clientObject.db("videotutorials");
      database.collection("tblusers").find({}).toArray()
      .then(documents =>{
        response.send(documents);
        response.end();
      }); 
    });
});

app.get("/getadmin",(request,response)=>{
    mongoClient.connect(conString)
    .then(clientObject =>{
      var database = clientObject.db("videotutorials");
      database.collection("tbladmin").find({}).toArray()
      .then(documents =>{
        response.send(documents);
        response.end();
      }); 
    });
});

app.get("/getcategories",(request,response)=>{
    mongoClient.connect(conString)
    .then(clientObject =>{
      var database = clientObject.db("videotutorials");
      database.collection("tblcategories").find({}).toArray()
      .then(documents =>{
        response.send(documents);
        response.end();
      }); 
    });
});

app.get("/getvideos",(request,response)=>{
    mongoClient.connect(conString)
    .then(clientObject=>{
        var database = clientObject.db("videotutorials");
        database.collection("tblvideos").find({}).toArray()
        .then(documents=>{
            response.send(documents);
            response.end();
        });
    });
});
app.get("/getvideo/:id",(request,response)=>{
    var id = parseInt(request.params.id);
    mongoClient.connect(conString)
    .then(clientObject=>{
        var database = clientObject.db("videotutorials");
        database.collection("tblvideos").find({VideoId:id}).toArray()
        .then(documents=>{
            response.send(documents);
            response.end();
        });
    });
});

app.post("/adduser",(request,response)=>{
   var user = {
    "UserId":request.body.UserId,
    "UserName":request.body.UserName,
    "Password":request.body.Password,
    "Email":request.body.Email,
    "Mobile":request.body.Mobile
   }
   mongoClient.connect(conString)
   .then(clientObject=>{
    var database = clientObject.db("videotutorials");
    database.collection("tblusers").insertOne(user)
    .then(()=>{
        console.log("User Added");
        response.end();
    });
   });
});

app.post("/addvideo",(request,response)=>{
    var video = {
        "VideoId":parseInt(request.body.VideoId),
        "Title":request.body.Title,
        "Url":request.body.Url,
        "Likes":parseInt(request.body.Likes),
        "Views":parseInt(request.body.Views),
        "CategoryName":request.body.CategoryName
    }
    mongoClient.connect(conString)
    .then(clientObject=>{
      var database = clientObject.db("videotutorials");
      database.collection("tblvideos").insertOne(video)
      .then(()=>{
        console.log("Video Added");
      });
    });
});

app.put("/updatevideo/:id",(request, response)=>{
  var id = parseInt(request.params.id);

  mongoClient.connect(conString)
  .then(clientObject=>{
    var database = clientObject.db("videotutorials");
    database.collection("tblvideos").updateOne({},{$set: {VideoId:parseInt(request.body.VideoId),Title:request.body.Title,Url:request.body.Url, Likes:parseInt(request.body.Likes),Views:parseInt(request.body.Views),CategoryName:request.body.CategoryName}})
    .then(()=>{
      console.log("Video Updated..");
    });
  });
});


app.delete("/deletevideo/:id",(request,response)=>{
  var id = parseInt(request.params.id);
  mongoClient.connect(conString)
  .then(clientObject=>{
    var database = clientObject.db("videotutorials");
    database.collection("tblvideos").deleteOne({VideoId:id})
    .then(()=>{
      console.log("Video Deleted");
    });
  });
});

app.listen(5050);
console.log(`Server started : http://127.0.0.1:5050`);