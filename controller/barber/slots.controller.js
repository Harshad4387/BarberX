const Barber = require("../../models/Barber.model");
const BarberService = require("../../models/service.model");
const Slot = require("../../models/slots.model");
const Booking = require("../../models/Booking.model");

const getAllSlotsInShop = async (req, res) => {
  try {
    const userId = req.user._id;

    // 🔍 Find barber
    const barber = await Barber.findOne({ userId });
    if (!barber) {
      return res.status(404).json({ message: "Barber profile not found" });
    }

    // 🔍 Get services
    const services = await BarberService.find({
      barberId: barber._id,
      isActive: true,
    }).select("_id serviceType workerName");

    if (services.length === 0) {
      return res.status(200).json({ slotsByService: {} });
    }

    const serviceIds = services.map(s => s._id);

    // 🔍 Get all slots
    const slots = await Slot.find({
      serviceId: { $in: serviceIds },
      isActive: true,
    })
      .populate("serviceId", "serviceType workerName")
      .lean();

    // 🔍 Get today's bookings
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0, 0, 0, 0
    );
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23, 59, 59, 999
    );

    const bookings = await Booking.find({
      barberId: barber._id,
      serviceId: { $in: serviceIds },
      status: "Booked",
      date: { $gte: startOfDay, $lte: endOfDay },
    }).select("slotId");

    // 🔁 Map booked slots
    const bookedSlotMap = new Set(
      bookings.map(b => b.slotId.toString())
    );

    // 🔹 Group result
    const grouped = {};

    slots.forEach(slot => {
      const service = slot.serviceId;
      const serviceKey = service._id.toString();

      if (!grouped[serviceKey]) {
        grouped[serviceKey] = {
          serviceType: service.serviceType,
          workerName: service.workerName,
          slots: [],
        };
      }

      grouped[serviceKey].slots.push({
        _id: slot._id,
        startTime: slot.startTime,
        endTime: slot.endTime,
        status: bookedSlotMap.has(slot._id.toString())
          ? "Booked"
          : "UnBooked",
      });
    });

    return res.status(200).json({
      message: "Slots fetched successfully",
      slotsByService: grouped,
    });

  } catch (error) {
    console.error("Error in getAllSlotsInShop:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getAllSlotsInShop };
