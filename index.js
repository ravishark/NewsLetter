//jshint esversion:6
const express=require('express');   
const request=require('request');
const bodyParser=require('body-parser');
const https=require('https');


const app=express();
//for accesing local css files
app.use(express.static('public'));
//for accessing data from singup page
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html")
})


app.post("/",function(req,res){
  const fname=req.body.fname;
  const lname=req.body.lname;
  const email=req.body.email;
  
  const data ={
      members:[{
        email_address:email,
        status:"subscribed",
        merge_fields:{
            FNAME:fname,
            LNAME:lname
        }
      }]
  };

  const jsonData=JSON.stringify(data);

  const url="https://us1.api.mailchimp.com/3.0/lists/a61f5c4252";

  const options ={
      method: "POST",
      auth: "ravi:19d3226c15137459f5bfa2f01e3fd288-us1"
  }
   
  //for posting data to mailchimp
  const request= https.request(url,options,function(response){
      if(response.statusCode==200){
          res.sendFile(__dirname+"/success.html");
      }else{
          res.sendFile(__dirname+"/failure.html");
      }
     response.on("data",function(data){
         console.log(JSON.parse(data));
     })
  })
  request.write(jsonData);
  request.end();
});

//redirecting after failure
app.post("/failure",function(req,res){
    res.redirect("/");
})

app.listen( process.env.Port || 3000,function(){
    console.log("Server is running on Port 3000");
})
//id 
//a61f5c4252
//api key
//19d3226c15137459f5bfa2f01e3fd288-us1