const express = require("express");
const connectdb = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const tutorRoutes = require("./routes/tutorRoutes");
const assigmnetRoutes = require("./routes/assignmentRoutes");

const app = express();
connectdb();
app.use(express.json());

//user routes
app.use("/api/user", userRoutes);

//tutor api
app.use("/api/tutor", tutorRoutes);

//assigmnet api
app.use("/api/assignment", assigmnetRoutes);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
