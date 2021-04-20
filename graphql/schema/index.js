const graphql = require("graphql");
const {articlesQueries} = require("./articles");
const {userQueries,userMutations} = require("./users");
const {GraphQLObjectType,GraphQLSchema} = graphql;

let queries = {};
let mutations = {};

queries = extend(queries,articlesQueries);
queries = extend(queries,userQueries);

mutations = extend(mutations,userMutations);

const RootQuery = new GraphQLObjectType({
    name:'RootQuery',
    fields:queries,
});

const RootMutation = new GraphQLObjectType({
    name:'RootMutation',
    fields:mutations
});

module.exports = new GraphQLSchema({
    query:RootQuery,
    mutation:RootMutation,
});

function extend(dest, src) { 
    for(var key in src) { 
        dest[key] = src[key]; 
    } 
    return dest; 
} 