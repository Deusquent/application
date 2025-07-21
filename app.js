require('dotenv').config(); 
const express = require("express")
const session = require("express-session")
const userRoute = require("./src/routes/userRoute")
const vehicleRoute = require("./src/routes/vehicleRoute")
const mecanoRoute = require("./src/routes/mecanoRoute")
const loginRoute = require("./src/routes/loginRoute")
const registerRoute = require("./src/routes/registerRoute")
const dashboardMecanoRoute = require("./src/routes/dashboardMecanoRoute")
const dashboardUserRoute = require("./src/routes/dashboardUserRoute");
const documentRoute = require("./src/routes/documentsRoute");
// const apiRoute = require('./routes/vehicleRoute');


const app = express();

app.set('views', './src/views')
app.set('view engine', 'twig')
app.use(express.static("./public"))
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { httpOnly: true }
}));
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

app.use(userRoute);
app.use(mecanoRoute);
app.use(loginRoute);
app.use(vehicleRoute);
app.use(registerRoute);
app.use(dashboardMecanoRoute);
app.use(dashboardUserRoute);
app.use(documentRoute);


// app.use(apiRoute);


app.listen(3000, ()=>{
    console.log("Écoute sur le port 3000");
})