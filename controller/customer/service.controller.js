const BarberService = require("../../models/service.model");
const Barber = require("../../models/Barber.model");

const getServicesByBarberId = async (req, res) => {
  try {
    const { barberId } = req.params;
    const barber = await Barber.findById(barberId);
    if (!barber) {
      return res.status(404).json({
        success: false,
        message: "Barber not found"
      });
    }
    console.log(`barber is ${barber}`);

    const services = await BarberService.find({
      barberId,
      isActive: true
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: services.length,
      services
    });

  } catch (error) {
    console.error("Error fetching barber services:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

module.exports = {getServicesByBarberId};