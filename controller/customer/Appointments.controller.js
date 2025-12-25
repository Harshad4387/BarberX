const Booking = require("../../models/Booking.model");

const getTodayAppointments = async (req, res) => {
  try {
    const customerId = req.user.id;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await Booking.find({
      customerId,
      status: "Booked",
      date: { $gte: startOfDay, $lte: endOfDay },
    })
      .populate("barberId", "shopName shopAddress")
      .populate("serviceId", "serviceType price timeRequired")
      .sort({ startTime: 1 });
      
    return res.status(200).json({
      message: "Today's appointments fetched successfully",
      count: bookings.length,
      appointments: bookings.map(b => ({
        _id: b._id,

        // Salon
        shopName: b.barberId.shopName,
        shopAddress: b.barberId.shopAddress,

        // Service
        serviceType: b.serviceId.serviceType,
        duration: b.serviceId.timeRequired,
        price: b.serviceId.price,

        // Timing
        date: b.date,
        startTime: b.startTime,
        endTime: b.endTime,

        status: b.status,
      })),
    });

  } catch (error) {
    console.error("Error fetching today's appointments:", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


module.exports = { getTodayAppointments };
