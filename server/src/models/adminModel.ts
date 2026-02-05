import { Schema, model, type Document } from "mongoose";
import bcrypt from "bcryptjs";

interface AdminInfo {
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
  role: "super-admin" | "moderator";
  status: "active" | "deactivated";
  description?: string; // Description means of who added the user;
}

interface IAdmin extends AdminInfo, Document {
  createdAt: string;
  updatedAt: string;
  validatePassword: (
    plainPassword: string,
    username: string,
  ) => Promise<boolean>;
}

const adminSchema = new Schema<IAdmin>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userName: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ["super-admin", "admin"] },
    status: { type: String, required: true, enum: ["active", "deactivated"] },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

adminSchema.methods.validatePassword = async function <T extends string>(
  plainPassword: T,
  username: T,
): Promise<boolean> {
  const result = await bcrypt.compare(plainPassword, this.password);
  return result && username === this.username;
};

adminSchema.virtual("fullName").get(function (this: {
  firstName: string;
  lastName: string;
}) {
  return `${this.firstName} ${this.lastName}`;
});

adminSchema.pre("updateOne", async function (next) {
  const update = this.getUpdate() as any;

  if (update?.$set?.password) {
    update.$set.password = await bcrypt.hash(update.$set.password, 10);
  }

  if (update?.password) {
    update.password = await bcrypt.hash(update.password, 10);
  }

  this.setUpdate(update);
  next();
});

adminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

const AdminModel = model<IAdmin>("PoliceAdmin", adminSchema);

export { AdminModel };
