import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  prodcutId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const orderSchema = mongoose.Schema(
  {
    orderPrice: {
      type: Number,
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    orderItems: {
      type: [orderItemSchema],
    },
    // orderItems: {
    //   type: [
    //     {
    //       prodcutId: {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "Product",
    //       },
    //       quantity: {
    //         type: Number,
    //         required: true,
    //       },
    //     },
    //   ],
    // },
    address: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Cancelled", "Delivered"],
      default: "Pending",
      required: true,
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
