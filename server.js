const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongo = require("mongoose");
const axios=require("axios")
require("dotenv").config();
const nodemailer = require("nodemailer");

//import registration model
const fs=require("fs");
const registrationSchema = require("./models/registration");
const productSchema = require("./models/product");
// Database connection
mongo
  .connect(process.env.MONGODB)
  .then(() => {
    console.log("DataBase is Connected");
  })
  .catch((e) => {
    console.log("Database is not connected;", e);
  });
//middlewares
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cors());

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  // Pass to next layer of middleware
  next();
});
app.get("/getproducts",async (req, res) => {

  //  var aa = await productSchema.find()
  //  res.send(aa)
 

  var aa=fs.readFileSync("./bigdataa.json")
  res.send(JSON.parse(aa))


  
});

app.post("/forgetpassword",async(req,res)=>{
  const data1 = await registrationSchema.find({ email: req.body.email });


  if(data1.length==0){
    res.send({msg:"This email is not exist"})
  }
  else{
   // res.send({msg:"Check your email for password"})
    let trans=nodemailer.createTransport({
    
      service:"gmail",
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, 
      auth:{
          user:process.env.ID,
          pass:process.env.PASS
      }
    }) 

    let mailOptions={
      from:process.env.ID,
       to:req.body.email,
       subject:"FORGET PASSWORD",
       text:`Your DATABOT password is ${data1[0].password} `
     };

     trans.sendMail(mailOptions,(err,data)=>{
      if(err){
          //res.send({msg:"This email is not correct"})
          console.log(err)
      }
      else{
        res.send({msg:"Check your email for password"})

      }
    });
    

  }

})



app.get("/userregistration/:username", (req, res) => {
  res.send({ name: req.params.username });
});

//signup
app.post("/userregistration", async (req, res) => {
  console.log(req.body);
  //res.send(req.body)

  const data1 = await registrationSchema.find({ email: req.body.email });
  console.log();

  if (data1.length == 1) {
    res.send("This Email is already exist");
  } else if (req.body.password != req.body.cpassword) {
    res.send("Enter same password");
  } else {
    const data = new registrationSchema();
    data.username = req.body.username;
    data.email = req.body.email;
    data.password = req.body.password;
    data.gender = req.body.gender;

    data
      .save()
      .then(() => {
        res.send("User Registered");
      })
      .catch((err) => {
        var error = err.message;
        res.send(error.slice(38));
      });
  }
});


app.get("/getproductss",()=>{

  var brands=["https://t.ly/PeCQ",
  "https://t.ly/XWzF",
  "https://t.ly/9vxf",
"https://t.ly/zG7K",
"https://t.ly/jary",
"https://t.ly/pF9x",
"https://t.ly/PQYP",
"https://t.ly/jaHZ",
"https://t.ly/1Gjb",
"https://t.ly/bw7H",
"https://t.ly/j_d_",
"https://t.ly/RQnv",
"https://t.ly/ueNi",
"https://t.ly/J_Il",
"https://t.ly/uW-P",
"https://t.ly/z3mZ",
"https://t.ly/ifmX",
"https://t.ly/SKvO",
"https://t.ly/6jWy",
"https://t.ly/Yg_4",
"https://t.ly/-ELF",
"https://t.ly/WuEM",
]

brands.map(i=>{

  res.send(i.readdata(i.data))
})
})
//sigin

// app.post("/signin", async (req, res) => {
//   try {
//     const user = await registrationSchema.findOne(
//       {
//         email: req.body.email,
//         password: req.body.password,
//       },
//       "email"
//     );
//     if (!user) return res.status(404).send({ msg: "Invalid credentials" });
//     res.send({ user, msg: "log In Successful" });
//   } catch (error) {
//     res.status(500).send({ message: error.message });
//   }
// });

//////////////////////////
// app.post("/signin", async (req, res) => {
//   // console.log(req.body)
//   const data1 = await registrationSchema.find({ email: req.body.email });

//   if (data1.length == 0) {
//     res.send({msg:"This Email is not registered"});
//   } else if (data1[0].password != req.body.password) {
//     res.send({ msg: "Incorrent Password" });
//   } else {
//     res.send({
//       msg: "log In Successful",
//       login: true,
//     });
//   }
// });
app.post("/signin", async (req, res) => {
  // console.log(req.body)
  const data1 = await registrationSchema.find({ email: req.body.email });

  if (data1.length == 0) {
    res.send({msg:"This Email is not registered"});
  } else if (data1[0].password != req.body.password) {
    res.send({ msg: "Incorrent Password" });
  } else {
    res.send({
      user:data1[0],
      msg: "log In Successful",
     
    });
  }
});


//update user
app.post("/updateuser", async (req, res) => {
  const data = req.body;
  await registrationSchema
    .updateOne(
      { email: data.email },
      { $set: { username: data.username, password: data.password } }
    )
    .then(() => {
      res.send("user updated");
    })
    .catch(() => {
      res.send("there is something wrong");
    });
});

app.listen(process.env.PORT || 5000, () => {
  console.log("server is ON!");
});
 