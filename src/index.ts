import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { identifyRouter } from "./routes/identify.routes";


dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/v1/identify",identifyRouter);

app.get("/api/v1", (req, res) => {
  res.send("Welcome to the Find Reconcillation API. Go to /indentify route");
});

app.use("*",(req,res)=>{
    return res.status(404).json({msg:"You have entered a wrong path"});
})

const PORT = process.env.PORT;


app.listen(PORT, () => {
    try{
        console.log(`Server is running on port ${PORT}`);
    }catch(err:any){
        console.log(err.message);
    }
  
});