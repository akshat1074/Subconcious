import mongoose, {model,Schema} from "mongoose";

mongoose.connect("mongodb+srv://akshat_valani1074:B74RpzsvreHJXctt@cluster0.dqxlj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

const UserSchema =new Schema ({
    username:{type:String,unique:true},
    password: String
})

 export const UserModel =model('User',UserSchema);

 const ContentSchema = new Schema({
    title:String,
    link:String,
    tags:[{type:mongoose.Types.ObjectId,ref:'Tag'}],
    type:String,
    userId:{type:mongoose.Types.ObjectId,ref:'User',required:true},
 })

 const LinkSchema = new Schema({
    hash:String,
    userId:{type:mongoose.Types.ObjectId,ref:"User",required:true},
 })

  export const LinkModel = model("Links",LinkSchema);
  export const ContentModel = model("Content",ContentSchema)