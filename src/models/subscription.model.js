import mongoose,{model,Schema} from "mongoose";

const subscriptionSchema = new Schema({
    subscriber:{
        type: Schema.Types.ObjectId,
        ref:"User"
    },
    channel :{
        type: Schema.Types.ObjectId,
        ref:"User"
    }
})

const Subscription = model("Subscription",subscriptionSchema)