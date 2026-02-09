import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { AdminModel } from "@/models/adminModel";

type Done = (error: any, user?: Express.User | false, info?: any) => void;

passport.use(
  new LocalStrategy(
    {
      usernameField: "userName",
      passwordField: "password",
    },
    async (userName: string, password: string, done: Done) => {
      try {
        const user = await AdminModel.findOne({ userName: userName });
        if (!user) throw new Error();
        const isCorrect = await user.validatePassword(password, userName);
        if (isCorrect) {
          done(null, user);
        } else {
          done(null, false);
        }
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  console.log(user);
  done(null, (user as any)._id);
});

passport.deserializeUser(async (id: Express.User, done) => {
  try {
    const user = await AdminModel.findById(id, {
      userName: 1,
      firstName: 1,
      lastName: 1,
      createdAt: 1,
      updatedAt: 1,
    });
    console.log("From passport: ", user);
    if (!user) throw new Error("User not found (from passport)");
    done(null, user);
  } catch (err) {
    done(err);
  }
});