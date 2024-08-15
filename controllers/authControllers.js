const { default: axios } = require("axios");
const dotenv = require("dotenv");
const QueryString = require("qs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
dotenv.config();

const getGoogleAuthURL = () => {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };

  return `${rootUrl}?${QueryString.stringify(options)}`;
};

exports.login = (req, res) => {
  res.redirect(getGoogleAuthURL());
};

exports.googleOAuthHandler = async (req, res) => {
  const { code } = req.query;
  const values = {
    code,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_OAUTH_REDIRECT_URL,
    grant_type: "authorization_code",
  };
  try {
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      QueryString.stringify(values),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token } = tokenResponse.data;

    const userInfoResponse = await axios.get(
      `https://www.googleapis.com/oauth2/v3/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const {
      sub: googleId,
      email,
      name,
      picture: profileImage,
    } = userInfoResponse.data;

    let user = await User.findOne({ googleId });

    if (!user) {
      user = new User({
        googleId,
        email,
        name,
        profileImage,
      });
      await user.save();
    } else {
      if (user.profileImage !== profileImage) {
        user.profileImage = profileImage;
        await user.save();
      }
    }

    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
      sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
      secure: process.env.NODE_ENV === "Development" ? false : true,
    });

    res.redirect(`${process.env.FRONTEND_URL}`);
  } catch (error) {
    console.error("OAuth callback error:", error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
  }
};

exports.logout = (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
    secure: process.env.NODE_ENV === "Development" ? false : true,
  });
  res.status(200).json({ message: "Logged out successfully" });
};
