import mongoose from "mongoose";

const subTodosSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    complete: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true } //created,update date
);

export const SubTodo = mongoose.model("SubTodo", subTodosSchema);
