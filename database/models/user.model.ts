import { Schema, model, models, Document } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String },
  },
  { timestamps: true },
);

const User = models?.User || model("User", UserSchema);

export default User;
