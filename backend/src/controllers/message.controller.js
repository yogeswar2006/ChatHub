import messageModel from "../models/message.model.js";
import userModel from "../models/user.model.js";
import imagekit from "../services/storage.service.js"


const getAllContacts = async (req, res) => {

    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await userModel.find({ _id: { $ne: loggedInUserId } }).select("-password");
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error at fetching all contacts", error);
        res.status(500).json({ message: "Internal server error" });
    }

}

const getMessagesByUserId = async (req, res) => {
    try {
        const myId = req.user._id;
        const { id: otherChatId } = req.params;

        const messages = await messageModel.find({
            $or: [
                { senderId: myId, receiverId: otherChatId },
                { senderId: otherChatId, receiverid: myId }
            ]
        })

        return res.status(200).json(messages)
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

const sendMessage = async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const { text, image } = req.body


        const myId = req.user._id;
        const imageUrl = "";

        if (image) {
            const result = await imagekit.UploadImage(image);
            imageUrl = result.url;
        }



        const newMessage = new messageModel({
            senderId: myId,
            receiverId,
            text,
            image: imageUrl

        })

        await newMessage.save()

        // todo : implement real time chatting feature  

        return res.status(201).json({ message: "Message sent success", newMessage })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error", error })
    }
}

const getAllChats = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        const messages = await messageModel.find({
            $or: [
                { senderId: loggedInUserId },
                { receiverId: loggedInUserId }
            ]
        })

        const chatPartnerIds = [
            ...new Set(
                messages.map((msg) => 
                    msg.senderId.toString() === loggedInUserId.toString() ? msg.receiverId.toString() : msg.senderId.toString()
                )
            ),
        ]

        const chatPartners = await userModel.find({ _id: { $in: chatPartnerIds } }).select("-password");

        res.status(200).json({ message: "chat partners fetched success", chatPartners });
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

export default { getAllContacts, getMessagesByUserId, sendMessage,getAllChats };