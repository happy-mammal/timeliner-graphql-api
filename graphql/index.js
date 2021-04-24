//Importing modules
const {graphqlHTTP} = require("express-graphql"); //-->GraphQl HTTP Middleware to work with GraphQL
const schema = require("./schema/index"); //-->Getting Schema to work with Query and Mutation

//Exporting modules
module.exports = graphqlHTTP({
    schema,//-->Passing the schema
    graphiql:true //-->Enabled the GraphiQL 
});