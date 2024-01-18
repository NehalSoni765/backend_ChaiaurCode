import mongoose from "mongoose";

const medicalRecordSchema = mongoose.Schema({}, { timeStamp: true });

export const MedicalRecord = mongoose.model(
  "MedicalRecord",
  medicalRecordSchema
);
