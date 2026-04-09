import express from "express";
import mongoose from "mongoose";
import UserModel from "./models/User.js";
import ContentModel from "./models/Content.js";
import { z } from "zod";
import jwt from "jsonwebtoken";
const Signin = z.object({
  username: z.string().min(3).max(10),
  password: z
    .string()
    .min(8)
    .max(20)
    .refine((data) => {
      const hasUpperCase = /[A-Z]/.test(data);
      const hasLowerCase = /[a-z]/.test(data);
      const hasNumber = /[0-9]/.test(data);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(data);
      return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
    }),
});
const Signup = Signin.safeExtend({
  share: z.boolean().default(false),
});

type SignupType = z.infer<typeof Signup>;
const Content = z.object({
  userid: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "invalid userid",
  }),
  type: z.enum(["document", "tweet", "youtube", "link"]),
  link: z.url(),
  title: z.string(),
  tags: z.array(z.string()),
});
type ContentType = z.infer<typeof Content>;
const DeleteObject = z.object({
  contentId: z.string(),
});
// type DeleteType = z.infer<typeof DeleteObject>;
const secretkey = process.env.secret || "mysecretkey";
mongoose
  .connect(process.env.MONGO_URL || "mongodb://localhost:27017/secondBrain")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });
const app = express();
app.use(express.json());

//MIDDLEWARES

const SignupCheck: express.RequestHandler = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const data = Signup.parse(req.body);
    req.body = data;
  } catch (err) {
    return res
      .status(402)
      .json({ message: "something happened while parsing body", err });
  }
  // if (!result.success) {
  //   return res
  //     .status(411)
  //     .json({ message: "Invalid input", errors: result.error });
  // }
  next();
};
const SigninCheck: express.RequestHandler = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const result = Signin.safeParse(req.body);
  if (!result.success) {
    return res
      .status(411)
      .json({ message: "Invalid input", errors: result.error });
  }
  next();
};
const isAuth: express.RequestHandler = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(403).json({ message: "invalid token or no token" });
  }
  try {
    const isverified = jwt.verify(token, secretkey) as jwt.JwtPayload;
    req.body.userid = isverified.id;
    next();
  } catch {
    return res.status(403).json({ message: "invalid token or no token" });
  }
};

//Apis

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.post("/api/v1/signup", SignupCheck, async (req, res) => {
  const { username, password, share } = req.body;
  const user: SignupType = { username, password, share };
  const userexists = await UserModel.findOne({ username });
  if (userexists) {
    return res.status(403).json({ message: "Username already exists" });
  }
  UserModel.create(user)
    .then((user) => {
      res.json({ message: "User created successfully", user: user });
    })
    .catch((err) => {
      res.status(500).json({ message: "Error creating user", error: err });
    });
});

app.post("/api/v1/signin", SigninCheck, async (req, res) => {
  const { username, password } = req.body;
  const userExists = await UserModel.findOne({ username, password });
  if (!userExists) {
    return res.status(403).json({ message: "Invalid username or password" });
  }
  const token = jwt.sign({ id: userExists._id }, secretkey, {
    expiresIn: "1h",
  });
  res.json({ token });
});
app.post("/api/v1/content", isAuth, (req, res) => {
  const result = Content.safeParse(req.body);
  if (!result.success) {
    return res
      .status(411)
      .json({ message: "Invalid input", errors: result.error });
  }
  const { type, link, title, tags, userid } = req.body;
  const content: ContentType = {
    userid,
    type,
    link,
    title,
    tags,
  };
  ContentModel.create(content)
    .then((content) =>
      res.status(200).json({ message: "content added", content }),
    )
    .catch((err) => {
      res.status(502).json({ message: "couldnt add content", error: err });
    });
});
app.get("/api/v1/content", isAuth, async (req, res) => {
  const { userid } = req.body;
  const contents = await ContentModel.find({ userid });
  res
    .status(200)
    .json({ message: "here is the all content of user", contents });
});
app.delete("/api/v1/content", isAuth, async (req, res) => {
  const isvalid = DeleteObject.safeParse(req.body);
  if (!isvalid.success) {
    return res.status(401).json({ message: "provide valid input" });
  }
  const { userid, contentId } = req.body;
  ContentModel.deleteOne({ _id: contentId, userid })
    .then((content) =>
      res.status(200).json({ message: "deleted successfully", content }),
    )
    .catch((err) => res.status(501).json({ message: "couldnt delete", err }));
});
// app.get("/api/v1/brain/share", isAuth);
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
