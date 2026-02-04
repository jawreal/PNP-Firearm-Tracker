import dotenv from "dotenv";
dotenv.config();
import morgan from "morgan";
import express, { type Request, type Response } from "express";
import cors from "cors";
import errorHandler from "@/middleware/errorHandler";
import passport from "passport";
import session from "express-session";
import { store } from "@/config/dbConfig";
import "@/config/passportStrat";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import policeRouter from "@/routers/policeRouter";
/*import mongoSanitize from "express-mongo-sanitize";*/
import path from "path";

const app = express();
const isDeployed: boolean = process.env.NODE_ENV === "production";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(morgan(isDeployed ? "combined" : "dev"));
app.disabled("x-powered-by");
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);
if (!isDeployed) {
  app.use(
    cors({
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    }),
  );
}
app.use(express.json());
/*app.use(mongoSanitize());*/
if (isDeployed) {
  app.use("/api/auth", limiter);
}
app.use(
  session({
    secret: process.env.PASSPORT_SECRET ?? "",
    resave: false,
    rolling: false,
    saveUninitialized: false,
    store: store,
    proxy: true,
    cookie: {
      httpOnly: isDeployed, //must be false in production
      secure: isDeployed, //HTTPS only in production
      sameSite: isDeployed ? "strict" : "lax", //strict only in production
      maxAge: 1000 * 60 * 60 * 12,
    },
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/api/firearm", policeRouter);
// Routers here

const distPath = path.join(__dirname, "../../client/dist");
app.use(express.static(distPath));
app.get("/*splat", (_req: Request, res: Response) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.use(errorHandler);

export default app;
