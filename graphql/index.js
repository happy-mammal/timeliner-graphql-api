const {graphqlHTTP} = require("express-graphql");
const schema = require("./schema/index");

module.exports = graphqlHTTP({
    schema,
    graphiql:true
});