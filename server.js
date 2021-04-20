const  express = require("express");
const middleware = require("./graphql/index");
const app = express();

app.use('/api',middleware);

app.listen(9000,()=>{
    console.log("Listening")
});