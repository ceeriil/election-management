const express = require("express");
//express app
const app = express();

const port = 3000;
const mongoose = require("mongoose"); //to connect to mongodb

//connect to mongodb and listen to requests
mongoose.connect(
  "mongodb+srv://ceeriil:sd2o1TuvTg6d5DXh@cluster0.3y3rufd.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("connected"));

//register view engine
app.set("view engine", "ejs");
//middleware and static files
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Provide the extended option

//express layouts
var expressLayouts = require("express-ejs-layouts");
app.use(expressLayouts);
app.set("layout", "layouts/layout");

//polling agent and polling unit routes
const agentRoutes = require("./routes/pollingAgentRoutes");
const unitRoutes = require("./routes/pollingUnitRoutes");
app.use("/pollingAgent", agentRoutes);
app.use("/pollingUnit", unitRoutes);

//routes
app.get("/", (req, res) => {
  res.render("index");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// 404 page
app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});
