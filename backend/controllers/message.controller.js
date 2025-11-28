import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsersForSideBar= async (req,res)=>{
    try {
        const loggedInUserId=req.user._id;
        const filteredUsers=await User.find({_id:{$ne:loggedInUserId}}).select("-password")

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("error in getUsersForSideBar: " ,error);
        res.status(500).json({error:"internal server error"})
    }
}

export const getMessages= async (req,res)=>{
    try {
        const {id:userToChatId}=req.params;
        const myId=req.user._id;

        const messages=await Message.find({
            $or:[
                {senderId:myId,receiverId:userToChatId},
                {senderId:userToChatId,receiverId:myId}
            ]
        }).sort({createdAt:1}); 
        res.status(200).json(messages);
    } catch (error) {
        console.log("error in getMessage controller: ",error)
        res.status(500).json({error:"internal server error"})
    }
}

export const sendMessage= async(req,res)=>{
    try {
        const {text,image}=req.body;
        const {id:receiverId}=req.params;
        const senderId=req.user._id;
        let imageUrl;
        if(image){
            const uploadResponse=await cloudinary.uploader.upload(image);
            imageUrl=uploadResponse.secure_url;
        }
        const newMessage=new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl
        })
        await newMessage.save();
        const populatedMessage = await newMessage.populate("senderId receiverId");

        const io = req.app.get("io");
        if(io){
            io.to(receiverId.toString()).emit("newMessage",populatedMessage);
            io.to(senderId.toString()).emit("newMessage",populatedMessage);
        }

        res.status(201).json(populatedMessage);

    } catch (error) {
        console.log("error in sendMessage controller",error)
        res.status(500).json({error:"internal server error"})
    }
}
