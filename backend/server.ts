import express from "express";
import mongoose from "mongoose";
import UserModel from "./models/User.js";
import ContentModel from "./models/Content.js";
import { z } from "zod";
import jwt from "jsonwebtoken";
import cors from "cors";
import TagModel from "./models/Tags.js";

interface AuthRequest extends express.Request {
  userid?: string;
}
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
const Share = z.object({
  share: z.boolean(),
});
const Content = z.object({
  userid: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "invalid userid",
  }),
  type: z.enum(["document", "tweet", "youtube", "link"]),
  link: z.string(),
  title: z.string(),
  tags: z.array(z.string()),
});
// type ContentType = z.infer<typeof Content>;
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
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
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
  req: AuthRequest,
  res: express.Response,
  next: express.NextFunction,
) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(403).json({ message: "invalid token or no token" });
  }
  console.log("crossed this");
  try {
    const isverified = jwt.verify(token, secretkey) as jwt.JwtPayload;
    console.log("isverified:", isverified);
    req.userid = isverified.id;
    next();
  } catch (err) {
    return res.status(403).json({ err });
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
      const token = jwt.sign({ id: user._id }, secretkey, {
        expiresIn: "1h",
      });
      res.json({ message: "User created successfully", user: user, token });
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

app.post("/api/v1/content", isAuth, async (req, res) => {
  const result = Content.safeParse(req.body);
  if (!result.success) {
    return res
      .status(411)
      .json({ message: "Invalid input", errors: result.error });
  }
  const { type, link, title, tags } = req.body;
  const userid = (req as AuthRequest).userid;
  // const tagsids = [];
  // tags.map(async (tag: string) => {
  //   const res = await TagModel.findOne({ title: tag });
  //   if (!res) {
  //     const user = await TagModel.create({ title: tag });
  //     tagsids.push(user._id);
  //   } else {
  //     tagsids.push(res._id);
  //   }
  // });

  try {
    const tagsids = await Promise.all(
      tags.map(async (tag: string) => {
        let tagDoc = await TagModel.findOne({ title: tag });

        if (!tagDoc) {
          tagDoc = await TagModel.create({ title: tag });
        }

        return tagDoc._id;
      }),
    );

    const content = {
      userid: new mongoose.Types.ObjectId(userid),
      type,
      link,
      title,
      tags: tagsids,
    };

    const saved = await ContentModel.create(content);

    res.status(200).json({ message: "content added", content: saved });
  } catch (err) {
    res.status(502).json({ message: "couldnt add content", error: err });
  }
});
const isAuthGet: express.RequestHandler = (
  req: AuthRequest,
  res: express.Response,
  next: express.NextFunction,
) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(403).json({ message: "invalid token or no token" });
  }
  try {
    const isverified = jwt.verify(token, secretkey) as jwt.JwtPayload;
    req.userid = isverified.id;
    next();
  } catch {
    return res.status(403).json({ message: "invalid token or no token" });
  }
};

// app.get("/api/v1/content", isAuthGet, async (req, res) => {
//   const { userid } = req as AuthRequest;
//   console.log(userid, "bitch");
//   if (!userid)
//     return res.status(403).json({ message: "no token here (made by me)" });
//   try {
//     const contents = await ContentModel.find({
//       userid: new mongoose.Types.ObjectId(userid),
//     });
//     const enrichedContents = await Promise.all(
//       contents.map((content) => {
//         const tags = content.tags.map(async (_id: mongoose.Types.ObjectId) => {
//           return await TagModel.findById(_id);
//         });
//         return {
//           ...content.toObject(),
//           tags,
//         };
//       }),
//     );
//     console.log(enrichedContents);
//     res.status(200).json({
//       message: "here is the content",
//       contents: enrichedContents,
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: "something went wrong",
//       err,
//     });
//   }
// });
app.get("/api/v1/content", isAuthGet, async (req, res) => {
  const { userid } = req as AuthRequest;

  if (!userid) {
    return res.status(403).json({ message: "no token here" });
  }
  try {
    const contents = await ContentModel.find({
      userid: new mongoose.Types.ObjectId(userid),
    });

    const enrichedContents = await Promise.all(
      contents.map(async (content) => {
        const tags = await Promise.all(
          content.tags.map(async (_id: mongoose.Types.ObjectId) => {
            const tag = await TagModel.findById(_id);

            return tag?.title;
          }),
        );

        const ret = {
          ...content.toObject(),
          tags,
        };

        return ret;
      }),
    );

    return res.status(200).json({
      message: "here is the all content of user",
      contents: enrichedContents,
    });
  } catch (err) {
    res.json(err);
  }
});
app.get("/api/v1/content/share/:username", async (req, res) => {
  const { username } = req.params;
  const User = await UserModel.findOne({ username });
  if (!User) return res.status(402).json({ message: "user not found" });
  const { share, _id: userid } = User;
  if (share) {
    const content = await ContentModel.find({ userid });
    return res.status(200).json({ username, content });
  } else {
    return res.status(403).json({ message: "inavlid access" });
  }
});

app.delete("/api/v1/content", isAuth, async (req, res) => {
  const isvalid = DeleteObject.safeParse(req.body);
  if (!isvalid.success) {
    return res.status(401).json({ message: "provide valid input" });
  }
  const { contentId } = req.body;
  const userid = (req as AuthRequest).userid;
  ContentModel.deleteOne({
    _id: new mongoose.Types.ObjectId(contentId),
    userid: new mongoose.Types.ObjectId(userid),
  })
    .then((content) =>
      res.status(200).json({ message: "deleted successfully", content }),
    )
    .catch((err) => res.status(501).json({ message: "couldnt delete", err }));
});

app.put("/api/v1/brain/share", isAuth, async (req, res) => {
  const result = Share.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: "wrong input " });
  }
  const { share } = req.body;
  const userid = (req as AuthRequest).userid;
  try {
    const user = await UserModel.findByIdAndUpdate(
      userid,
      {
        share,
      },
      { new: true },
    ).lean();
    if (!user) return res.status(404).json({ message: "no user exists" });
    const { username } = user;
    return res
      .status(200)
      .json({ link: `http://localhost:3000/api/v1/content/share/${username}` });
  } catch (err) {
    return res.status(503).json({ message: "something didnt work", err });
  }
});
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
