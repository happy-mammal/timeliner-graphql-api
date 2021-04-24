//Importing modules
const graphql = require("graphql");//-->graphql module to work with GraphQL types
const {articlesQueries} = require("./articles");//-->Getting articleQueries
const {userQueries,userMutations} = require("./users");//-->Getting userQueries and userMutations
const {GraphQLObjectType,GraphQLSchema} = graphql;//-->Using graphql data types

//Delaring empty queries and mutations
let queries = {};
let mutations = {};

//Extending queries
queries = extend(queries,articlesQueries);//-->Extending queries by adding articleQueries
queries = extend(queries,userQueries);//-->Extending queries by adding userQueries

//Extending mutations
mutations = extend(mutations,userMutations);//-->Extending mutaions by adding userMutations

//Creating RootQuery Type
const RootQuery = new GraphQLObjectType({
    name:'RootQuery',
    fields:queries,//-->Consist all queries
});
//Creating RootMutation Type
const RootMutation = new GraphQLObjectType({
    name:'RootMutation',
    fields:mutations //-->Consist all mutations
});
//Exporting Schema 
module.exports = new GraphQLSchema({
    query:RootQuery,//-->Exporting Root Query
    mutation:RootMutation,//Exporting Root Mutation
});

function extend(dest, src) { 
    for(var key in src) { 
        dest[key] = src[key]; 
    } 
    return dest; 
} 