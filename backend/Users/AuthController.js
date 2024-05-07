const User = require("./userModals");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const sendEmail = require("../utils/Email");
const crypto = require("crypto");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    secure: process.env.NODE_ENV === "production" && true,
    httpOnly: true,
  };

  res.cookie("jwt", token, cookieOptions);
  // Remove the Password
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    user,
  });
};

const defaultAvatarUrl =
  "https://t3.ftcdn.net/jpg/01/18/01/98/360_F_118019822_6CKXP6rXmVhDOzbXZlLqEM2ya4HhYzSV.jpg";

exports.signup = async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      avatar: { url: req.body.avatar || defaultAvatarUrl },
    });
    console.log(newUser);
    createSendToken(newUser, 201, res);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("Please provide email and password");
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.correctPassword(password, user.password))) {
      throw new Error("Incorect email or password");
    }
    createSendToken(user, 200, res);
  } catch (err) {
    res.status(400).json({
      message: "Login in unsuccessfull",
    });
  }
};

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 100),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(400).json({
      error: "There is no user with this email",
    });
  }
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  let resetURL = `${process.env.CLIENT_URL}/user/resetPassword/${resetToken}`;
  if (process.env.NODE_ENV === "production") {
    resetURL = `${req.protocol}://${req.get(
      "host"
    )}/user/resetPassword/${resetToken}`;
  }
  const message = `<p>Forgot your password? Submit a PATCH request with your new password and passwordConfirm. Click the button to resetpassword page.: <a href="${resetURL}" style=" display: inline-block; margin:10px; padding:10px; background-color: rgb(65, 60, 60, 0.5); border-radius:5px; text-decoration:none; color:white; font-size:20px">Reset Password.</a><p>`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token valid for 10 mins",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token send to email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(400).json({
      error: err.message,
    });
    return next();
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    // 1) Get user based on Token

    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    // 2) If Token has not expired, and there is user, set the new Password
    if (!user) {
      throw new Error("Token is invalid or Expired!!");
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 3) Update changedPasswordAt property for the user
    // 4) Log the user in, send JWT
    createSendToken(user, 200, res);
  } catch (err) {
    res.status(400).json({
      status: "fail",
      error: err.message,
    });
    return next();
  }
};

exports.protect = async (req, res, next) => {
  try {
    // 1) Getting the Token and check if it there
    let token;
    // console.log(req.cookies);
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt && req.cookies.jwt !== "loggedout") {
      token = req.cookies.jwt;
    }

    if (!token) {
      throw new Error("You are not Logged!! Please log in to get access");
    }

    //2) Verification Token

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if users still exsits

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      throw new Error("the user belonging to the token doesn't exsists");
    }

    // 4) Check If user change Password after the token is issued

    if (currentUser.changedPasswordAfter(decoded.iat)) {
      throw new Error("User recently cahnged the password, Please login again");
    }
    // Grant Access to protected route.
    req.user = currentUser;
    // res.locals.user = currentUser;
    next();
  } catch (err) {
    res.status(401).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.isLoggedIn = async (req, res, next) => {
  // 1) Getting the Token and check if it there
  try {
    console.log(req.cookies);
    if (req.cookies.jwt) {
      // Verfy the token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if users still exsits

      const currentUser = await User.findById(decoded.id);
      console.log("from login", currentUser);
      if (!currentUser) {
        return next();
      }

      // 3) Check If user change Password after the token is issued

      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }
      // There is a looged in user
      res.status(200).json({
        status: "success",
        user: currentUser,
      });
      return next();
    }
  } catch (err) {
    return next();
  }
};
