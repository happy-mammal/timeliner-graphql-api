const  express = require("express");
const middleware = require("./graphql/index");
const app = express();
const {port} = require("./config");

app.use('/api',middleware);

app.listen(port,()=>{
    console.log("Listening to port "+port)
});