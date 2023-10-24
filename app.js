const express = require("express");
const morgan = require("morgan");

const mongoose = require("mongoose");
const app = new express();
app.use(morgan("dev"));

require("dotenv").config();

app.use(express.json())
app.use(express.urlencoded({extended:true}));

// Task1: initiate app and run server at 3000

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running ${PORT}`);
});

const path = require("path");
app.use(express.static(path.join(__dirname + "/dist/FrontEnd")));

// Task2: create mongoDB connection

const empSchema = mongoose.Schema({
  name: String,
  location: String,
  position: String,
  salary: Number,
});
const empData = mongoose.model("employees", empSchema);

const PASS = process.env.PASS;
mongoose
  .connect(
    `mongodb+srv://aswindb:${PASS}@company.ck23ks9.mongodb.net/companydb?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("Connected to Hospital DB");
  })
  .catch(() => {
    console.log("Error ! No connection");
  });

//Task 2 : write api with error handling and appropriate api mentioned in the TODO below



//TODO: get data from db  using api '/api/employeelist'

app.get("/api/employeelist", async (req, res) => {
  try {
    const data = await empData.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(404).json(error);
  }
});


//TODO: get single data from db  using api '/api/employeelist/:id'

app.get("/api/employeelist/:id", async (req, res) => {
    try {
        const empId = req.params.id;
      const data = await empData.findById(empId);
      res.status(200).json(data);
    } catch (error) {
      res.status(404).json(error);
    }
  });




//TODO: send data from db using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}



app.post('/api/employeelist', async (req,res)=>{
try{
     var item = req.body;
      const data = new empData(item);
     const savedata = await data.save();
     res.status(200).json('Post Successful') 
}catch(error){
  res.status(404).json('Error');

}

})





//TODO: delete a employee data from db by using api '/api/employeelist/:id'


app.delete("/api/employeelist/:id", async (req, res) => {
  try {
      const empId = req.params.id;
    const data = await empData.findByIdAndRemove({_id:empId});
    res.status(200).json('Data Deleted');
  } catch (error) {
    res.status(404).json(error);
  }
});










//TODO: Update  a employee data from db by using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}



app.put('/api/employeelist', async (req,res)=>{
  try{
       
    // var upId = req.params.id;
    var item = req.body;
       
     const data= await empData.findOneAndUpdate({_id:item._id},item,{new:true});
       res.status(200).json('Updated Successful') 
  }catch(error){
    res.status(404).json('Error');
  
  }
  
  })
  
  








//! dont delete this code. it connects the front end file.
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname + "/dist/Frontend/index.html"));
});
