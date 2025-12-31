const BarberService = require("../../models/service.model");
const Slot = require("../../models/slots.model");
const Barber = require("../../models/Barber.model");
const Booking = require("../../models/Booking.model");
const mongoose = require("mongoose");

const getSlotsByServiceAndDate = async (req, res) => {
  try {
    const { serviceId, date } = req.query;

    if (!serviceId || !date) {
      return res.status(400).json({
        message: "serviceId and date are required",
      });
    }

    const serviceObjectId = new mongoose.Types.ObjectId(serviceId);

    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);


    const slots = await Slot.find({
      serviceId: serviceObjectId,
      isActive: true,
    }).sort({ startTime: 1 });

    const bookings = await Booking.find({
      serviceId: serviceObjectId,
      date: selectedDate,
      status: "Booked",
    }).select("slotId");

    const bookedSlotIds = bookings.map(b =>
      b.slotId.toString()
    );

    // 3️⃣ attach isBooked
    const finalSlots = slots.map(slot => ({
      ...slot.toObject(),
      isBooked: bookedSlotIds.includes(slot._id.toString()),
    }));

  

    return res.status(200).json({
      message: "Slots fetched successfully",
      slots: finalSlots,
    });

  } catch (error) {
    console.error("Error in getSlots:", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const createBooking = async (req, res) => {
  try {
    const { barberId, serviceId, slotId, date } = req.body;
    const customerId = req.user.id;

    if (!barberId || !serviceId || !slotId || !date) {
      return res.status(400).json({
        message: "barberId, serviceId, slotId and date are required",
      });
    }

    // 1️⃣ Validate barber
    const barber = await Barber.findById(barberId);
    if (!barber) {
      return res.status(404).json({ message: "Barber not found" });
    }

    // 2️⃣ Validate service
    const service = await BarberService.findOne({
      _id: serviceId,
      barberId,
      isActive: true,
    });

    if (!service) {
      return res.status(404).json({
        message: "Service not found or inactive",
      });
    }

    // 3️⃣ Validate slot
    const slot = await Slot.findOne({
      _id: slotId,
      serviceId,
      isActive: true,
    });

    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    if (slot.isBooked) {
      return res.status(400).json({ message: "Slot already booked" });
    }

    // 🔥 Normalize frontend date (MOST IMPORTANT PART)
    const inputDate = new Date(date); // ISO string → Date

    const bookingDate = new Date(
      inputDate.getFullYear(),
      inputDate.getMonth(),
      inputDate.getDate(),
      0, 0, 0, 0
    );

    // 4️⃣ Create booking
    const booking = await Booking.create({
      customerId,
      barberId,
      serviceId,
      slotId,

      date: bookingDate, // ✅ normalized frontend date

      startTime: slot.startTime,
      endTime: slot.endTime,
      status: "Booked",
    });

    // 5️⃣ Lock slot
    slot.isBooked = true;
    await slot.save();

    return res.status(201).json({
      message: "Booking confirmed successfully",
      booking,
    });

  } catch (error) {
    console.error("Booking error:", error);
    return res.status(500).json({ message: "Booking failed" });
  }
};


module.exports = { getSlotsByServiceAndDate ,createBooking};



