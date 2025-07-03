import User from "../models/user.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto"
import generateToken from "../utils/generateToken.js";

//register controller
export const registerUser=async (req,res)=>{
    const {name,email,password}=req.body;
    

    //check if user exist
    const UserExist=await User.findOne({email});
    if(UserExist) return res.status(400).json({message:"Email Already Exist"});

    const user=new User({name,email,password});
    const verificationToken=user.getVerificationToken() 
   
    await user.save();

      const verifyUrl = `${process.env.CLIENT_URL}verify-email/${verificationToken}`;
  const html = `<p>Click to verify: <a href="${verifyUrl}">${verifyUrl}</a></p>`;
  await sendEmail(user.email, "Verify your email", html);

  res.status(201).json({ message: "Registration successful. Check your email to verify." });  
}

// Email verification
export const verifyEmail = async (req, res) => {
  const tokenHash = crypto.createHash("sha256").update(req.params.token).digest("hex");
  const user = await User.findOne({ verificationToken: tokenHash });
  if (!user) return res.status(400).json({ message: "Invalid or expired token." });

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();

  res.status(200).json({ message: "Email verified successfully." });
};

// Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  if (!user.isVerified) {
    return res.status(403).json({ message: "Please verify your email first." });
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
};

// Forgot Password
export const forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const resetToken = user.getResetPasswordToken();
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  const html = `<p>Click to reset password: <a href="${resetUrl}">${resetUrl}</a></p>`;
  await sendEmail(user.email, "Reset your password", html);

  res.status(200).json({ message: "Password reset link sent to email." });
};

export const resetPassword = async (req, res) => {
  const tokenHash = crypto.createHash("sha256").update(req.params.token).digest("hex");
  const user = await User.findOne({
    resetPasswordToken: tokenHash,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ message: "Invalid or expired token." });

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({ message: "Password reset successful." });
};