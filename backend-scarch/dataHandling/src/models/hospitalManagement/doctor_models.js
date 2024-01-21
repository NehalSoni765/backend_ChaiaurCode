import mongoose from "mongoose";

const hospitalSchema = mongoose.Schema({
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
  },
  hours: {
    type: Number,
    default: 0,
  },
});
const doctorSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    salary: {
      type: String,
      required: true,
    },
    qualifications: {
      type: String,
      required: true,
    },
    experianceInYears: {
      type: Number,
      default: 0,
    },
    workInHospitals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospital",
      },
    ],
    worksHoursInHospital: [hospitalSchema],
  },
  { timestamps: true }
);

export const Doctor = mongoose.model("Doctor", doctorSchema);
