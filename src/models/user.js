import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
{
  name:{
    type:String,
    required:true
  },

  email:{
    type:String,
    required:true,
    unique:true
  },

  mobile:{
    type:String,
    required:true
  },

  className:{
    type:String,

  },

  category:{
    type:String,
  
  },

  password:{
    type:String,
    required:true
  },
   role:{
    type:String,
    required:true,
     default: "student",
  },
  refreshToken:{
    type:String,
    default:null
    
  }

},

{
 timestamps:true
}
);


export default mongoose.models.User ||mongoose.model("User",userSchema);