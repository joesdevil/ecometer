// app.js
const express = require("express");
const serverConfig = require("./config/server");
const connectToDb = require("./db/index");
const clientRouter = require("./routes/client");
const categoryRoutes = require("./routes/categoryRoutes");
const bilanRoutes = require("./routes/bilanRoutes");
const adminRoutes = require("./routes/admin");
const objectifRoutes = require("./routes/objectifs");
const logging = require("./middleware/logging");
const errorHandler = require("./middleware/errorHandler");
const { verifyClientToken } = require("./middleware/auth");
const bodyParser = require('body-parser');


const app = express();
const cors = require("cors");
//connect to db
connectToDb();

// Configure body-parser to handle larger payloads
app.use(bodyParser.json({ limit: '10mb' })); // Increase the limit as needed
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(logging);
app.use(errorHandler);
// Routes and other middleware...
app.use("/api/admin/", adminRoutes);
app.use("/api/Emission/", categoryRoutes);
app.use("/api/categories/", categoryRoutes);
app.use("/api/clients/", clientRouter);
app.use("/api/bilans/", verifyClientToken, bilanRoutes);
app.use("/api/objectifs/", verifyClientToken, objectifRoutes);




// Start the server
app.listen(serverConfig.port, () => {
  console.log(`Server is running on port ${serverConfig.port}`);
});



