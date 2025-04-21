import mongoose from "mongoose";
import { Password } from "../services/password";

interface UserI {
  email: string;
  password: string;
}

interface UserDocumentI extends mongoose.Document {
  email: string;
  password: string;
}

interface UserModelI extends mongoose.Model<UserDocumentI> {
  build(newUser: UserI): UserDocumentI;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

userSchema.statics.build = (newUser: UserI) => {
  return new User(newUser);
};

const User = mongoose.model<UserDocumentI, UserModelI>("User", userSchema);

export { User };
