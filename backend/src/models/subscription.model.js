import mongoose from "mongoose";

const subscriptionSchema = mongoose.Schema({
    subscriber:{ //subscriber 
        typpe:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    channel:{
        typpe:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timeStamp:true})

export const Subscription = mongoose.model("Subscription",subscriptionSchema)