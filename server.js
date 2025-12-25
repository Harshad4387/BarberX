require("dotenv").config();
const express = require("express");
const {connect} = require("./db/db");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

// connecting server to database
app.use(express.json());
app.use(morgan("dev"));
app.use(cors({
    origin : '*'
}));
connect();

app.get("/" , async(req,res) => {
    res.status(200).json("Server is running fine");
})

const auth = require("./routes/auth.route.js");
app.use("/api/barberX/auth" , auth);

//barber 
  // service
const barberService = require("./routes/Barber/Service.route.js");
app.use("/api/barberX/barber/Service" , barberService);

  // slots 
const barberSlots = require("./routes/Barber/Booking.route.js");
app.use("/api/barberX/barber/Slots" , barberSlots);

const CustomerShops = require("./routes/customer/shops.routes.js");
app.use("/api/barberX/Customer/shops" , CustomerShops);

const CustomerService = require("./routes/customer/service.route.js");
app.use("/api/barberX/Customer/services",CustomerService);

const CustomerBooking = require("./routes/customer/Booking.route.js");
app.use("/api/barberX/Customer/Booking" , CustomerBooking);

const port = process.env.port || 3000;
app.listen(port,()=>{
    console.log(`Server is running Built by ~harshu running on port ${port}`);
}) 