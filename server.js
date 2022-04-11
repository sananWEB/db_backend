const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongo = require("mongoose");
const axios=require("axios")
require("dotenv").config();
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

app.get("/getproducts", (req, res) => {

  // var aa = await productSchema.find();
  //var aa=fs.readFileSync("./bigdataa.json")

  //res.send(JSON.parse(aa))


  axios.get("https://raw.githubusercontent.com/sananWEB/db_backend/main/bigdataa.json").then((data)=>{res.send(data.data)})
   
 
  
});

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
