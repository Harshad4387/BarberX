const Barber = require("../../models/Barber.model");
const BarberService = require("../../models/service.model");
const { generateSlotsForService } = require("../../utilis/Slots/generateSlots");

const addService = async (req, res) => {
  try {
    const userId = req.user._id;
    const { serviceType, workerName, timeRequired, price } = req.body;

    const barber = await Barber.findOne({ userId });
    if (!barber) {
      return res.status(404).json({ message: "Barber profile not found" });
    }

    const service = await BarberService.create({
      barberId: barber._id,
      serviceType,
      workerName,
      timeRequired,
      price
    });

    const totalSlots = await generateSlotsForService({
      serviceId: service._id,
      openingTime: barber.openingTime,
      closingTime: barber.closingTime,
      timeRequired
    });

    return res.status(201).json({
      message: "Service and slots created successfully",
      service,
      totalSlotsCreated: totalSlots
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Slots already exist for this service"
      });
    }

    console.error("Error in addService:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const updateService = async (req, res) => {
  try {
    const userId = req.user._id;
    const { serviceId } = req.params;

    const { workerName, timeRequired, price } = req.body;

    // Find barber of logged-in user
    const barber = await Barber.findOne({ userId });
    if (!barber) {
      return res.status(404).json({
        message: "Barber profile not found"
      });
    }

    // Find service that belongs to this barber
    const service = await BarberService.findOne({
      _id: serviceId,
      barberId: barber._id
    });

    if (!service) {
      return res.status(404).json({
        message: "Service not found or not authorized"
      });
    }

    
    if (workerName !== undefined) service.workerName = workerName;
    if (timeRequired !== undefined) service.timeRequired = timeRequired;
    if (price !== undefined) service.price = price;

    await service.save();

    return res.status(200).json({
      message: "Service updated successfully",
      service
    });

  } catch (error) {
    console.log("Error in updateService:", error.message);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};
const deleteService = async (req, res) => {
  try {
    const userId = req.user._id;
    const { serviceId } = req.params;


    const barber = await Barber.findOne({ userId });
    if (!barber) {
      return res.status(404).json({
        message: "Barber profile not found"
      });
    }

    // Permanently delete service that belongs to this barber
    const service = await BarberService.findOneAndDelete({
      _id: serviceId,
      barberId: barber._id
    });

    if (!service) {
      return res.status(404).json({
        message: "Service not found or not authorized"
      });
    }

    return res.status(200).json({
      message: "Service deleted permanently"
    });

  } catch (error) {
    console.log("Error in deleteService:", error.message);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

const getMyServices = async (req, res) => {
  try {
 
    const userId = req.user._id;


    const barber = await Barber.findOne({ userId });
    if (!barber) {
      return res.status(404).json({
        message: "Barber profile not found"
      });
    }

   
    const services = await BarberService.find({
      barberId: barber._id,
      isActive: true
    }).sort({ createdAt: -1 });


    return res.status(200).json({
      message: "Services fetched successfully",
      totalServices: services.length,
      services
    });

  } catch (error) {
    console.error("Error in getMyServices:", error.message);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

module.exports = { addService , updateService ,deleteService,getMyServices};
