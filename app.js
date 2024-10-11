const express = require("express");
const connectdb = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const tutorRoutes = require("./routes/tutorRoutes");

const app = express();
connectdb();
app.use(express.json());

app.use("/api/user", userRoutes);

//tutor api
app.use("/api/tutor", tutorRoutes);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
