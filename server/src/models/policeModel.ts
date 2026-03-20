import { Schema, model } from "mongoose";

interface PoliceInfo {
  fullName: string;
  serialNumber: string;
  fireArmMake: string;
  fireArmType: "long" | "short";
  station: string;
  department: string;
  status: "issued" | "stocked" | "loss" | "disposition";
  isArchived?: boolean;
}

interface IPolice extends PoliceInfo {
  createdAt: string;
  updatedAt: string;
}

const policeSchema = new Schema<IPolice>(
  {
    fullName: { type: String, required: true },
    serialNumber: { type: String, required: true, unique: true },
    fireArmMake: { type: String, required: true },
    fireArmType: { type: String, required: true, enum: ["long", "short"] },
    station: { type: String, required: true },
    department: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ["issued", "stocked", "loss", "disposition", "turn in"],
    },
    isArchived: { type: Boolean, required: false, default: false },
  },
  {
    timestamps: true,
  },
);

const PoliceModel = model<IPolice>("PoliceModel", policeSchema);

export { PoliceModel, IPolice };
