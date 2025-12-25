const Barber = require("../../models/Barber.model");
const BarberService = require("../../models/service.model");
const Slot = require("../../models/slots.model");

const getAllSlotsInShop = async (req, res) => {
  try {
    const userId = req.user._id;

    const barber = await Barber.findOne({ userId });
    if (!barber) {
      return res.status(404).json({ message: "Barber profile not found" });
    }

    const services = await BarberService.find({
      barberId: barber._id,
      isActive: true,
    }).select("_id serviceType workerName");

    if (services.length === 0) {
      return res.status(200).json({ slotsByService: {} });
    }

    const serviceIds = services.map(s => s._id);

    const slots = await Slot.find({
      serviceId: { $in: serviceIds },
      isActive: true,
    })
      .populate("serviceId", "serviceType workerName")
      .sort({ date: 1, startTime: 1 })
      .lean();

    // 🔹 GROUP SLOTS BY SERVICE TYPE
    const grouped = {};

    slots.forEach(slot => {
      const serviceName = slot.serviceId.serviceType;

      if (!grouped[serviceName]) {
        grouped[serviceName] = [];
      }

      grouped[serviceName].push(slot);
    });

    return res.status(200).json({
      message: "Slots fetched successfully",
      slotsByService: grouped,
    });

  } catch (error) {
    console.log("Error in getAllSlotsInShop:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getAllSlotsInShop };
