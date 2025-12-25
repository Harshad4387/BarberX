const Barber = require("../../models/Barber.model");

const getAllShops = async (req, res) => {
  try {
   
    const { open } = req.query;

    const query = {};
    if (open === "true") {
      query.isOpen = true;
    }

    const shops = await Barber.find(query)
      .populate({
        path: "userId",
        select: "name phone email", 
      })
      .sort({ createdAt: -1 });
    return res.status(200).json({
      message: "Shops fetched successfully",
      totalShops: shops.length,
      shops,
    });
  } catch (error) {
    console.log("Error in getAllShops:", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = { getAllShops };
