const express = require("express");
const dotenv = require("dotenv");
const passport = require("passport");
const cors = require("cors");
const session = require("express-session");
const connectDB = require("./config/db");
const MongoStore = require("connect-mongo");
require("./config/passport");
dotenv.config();

const PORT = process.env.PORT;

const app = express();

app.use(express.json());

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};

app.use(cors(corsOptions));

console.log("Allowed Frontend URL:", process.env.FRONTEND_URL);

connectDB();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    name: "roastmyidea",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions",
    }),
    cookie: {
      secure: "auto",
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: "none",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/PostRoutes");
const commentRoutes = require("./routes/commentRoutes");
app.get("/", (req, res) => {
  res.send("YO!");
});

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
