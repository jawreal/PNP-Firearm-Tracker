import { Schema, model, type Document } from "mongoose";

interface PoliceInfo extends Document {
  firstName: string;
  lastName: string;
  serialNumber: string;
  fireArmType: string;
  station: string;
  department: string;
  status: "issued" | "stocked" | "loss" | "disposition";
}

interface IPolice extends PoliceInfo {
  createdAt: string;
  updatedAt: string;
}

const policeSchema = new Schema<IPolice>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  serialNumber: { type: String, required: true },
  fireArmType: { type: String, required: true },
  station: { type: String, required: true },
  department: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ["issued", "stocked", "loss", "disposition"],
  },
});

const PoliceModel = model<IPolice>("PoliceModel", policeSchema);

export { PoliceModel, IPolice };
