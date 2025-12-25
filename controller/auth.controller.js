const User = require("../models/User.model");
const Barber = require("../models/Barber.model");
const bcrypt = require("bcrypt");
const generatejwt = require("../utilis/generatetoken");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }


    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not registered. Please sign up first"
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Incorrect password"
      });
    }

    const token = await generatejwt(user._id);

    return res.status(200).json({
      message: "User logged in successfully",
      token,
      user,
      role : user.role
    });

  } catch (error) {
    console.log("Error in login controller:", error.message);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

const signup = async (req, res) => {
  try {
    const {
      name,           
      email,
      password,
      phone,
      role,
      shopName,
      shopAddress,
      gstNumber,
      openingTime,
      closingTime
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered"
      });
    }

 
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role 
    });

    if (role === "customer") {
      return res.status(201).json({
        message: "Customer registered successfully",
        user
      });
    }

    if (role === "barber") {
      if (!shopName || !shopAddress || !openingTime || !closingTime) {
        return res.status(400).json({
          message: "Missing barber shop details"
        });
      }

      const barber = await Barber.create({
        userId: user._id,
        shopName,
        shopAddress,
        gstNumber,
        openingTime,
        closingTime,
        phone
      });

      return res.status(201).json({
        message: "Barber registered successfully",
        user,
        barber
      });
    }

    return res.status(400).json({
      message: "Invalid role"
    });

  } catch (error) {
    console.log("Error in signup controller:", error.message);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};


const logout = async(req,res)=>{
try {   
    const options = {
        httpOnly : true,
        secure : true,
    };
        
   res.status(200).json({message : "logged out succesfully" , token : ""});
} catch (error) {
    console.log("error in logout controller" , error.message);
    res.status(500).json({message : "internal server error"});
    
}
    
}

module.exports = {
  login,
  signup,
  logout
};
