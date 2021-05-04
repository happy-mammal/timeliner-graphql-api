//Importing Modules
const  express = require("express"); //-->Express Module
const middleware = require("./graphql/index"); //-->GraphQL Server as middleware
const {port} = require("./configs/config"); //-->Port from configuration

//Initializing express app
const app = express(); 

//Express app using graphql middleware with /api as single endpoint to handel requests
app.use('/api',middleware);

//Express app listening to the specified port and starts running
app.listen(port,()=>{
    console.log("Listening to port -> "+port)
});