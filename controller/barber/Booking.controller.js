const Booking = require("../../models/Booking.model");
const Barber = require("../../models/Barber.model")
const getTodayBookingsByService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const userId = req.user._id; // from verifyjwt

    // 🔍 Find barber for this user
    const barber = await Barber.findOne({ userId });

    if (!barber) {
      return res.status(404).json({
        message: "Barber profile not found",
      });
    }

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

    // ✅ Filter by barberId ALSO
    const bookings = await Booking.find({
      barberId: barber._id,          // 🔑 IMPORTANT
      serviceId,
      status: "Booked",
      date: { $gte: startOfDay, $lte: endOfDay },
    })
      .populate("customerId", "name phone")
      .sort({ startTime: 1 });

    return res.status(200).json({
      message: "Today's bookings fetched successfully",
      count: bookings.length,
      bookings: bookings.map(b => ({
        _id: b._id,
        customerName: b.customerId?.name,
        phone: b.customerId?.phone,
        startTime: b.startTime,
        endTime: b.endTime,
      })),
    });

  } catch (error) {
    console.error("Error fetching bookings:", error);
    return res.status(500).json({
      message: "Failed to fetch bookings",
    });
  }
};


const markBookingDone = async (req, res) => {
  try {
    const { BookingId } = req.params;
    const userId = req.user._id; // coming from verifyjwt

    // 🔍 Find booking
    const booking = await Booking.findById(BookingId);
    const barber = await Barber.findOne({ userId });
    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // 🔒 Optional: ensure barber owns this booking
    if (booking.barberId.toString() !== barber._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to complete this booking",
      });
    }

    // ✅ Mark as done
    booking.status = "UnBooked";
    await booking.save();

    return res.status(200).json({
      message: "Booking marked as done successfully",
      booking,
    });

  } catch (error) {
    console.error("Error in markBookingDone:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};



module.exports = { getTodayBookingsByService ,markBookingDone };
