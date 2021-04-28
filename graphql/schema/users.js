//Importing modules
const graphql = require("graphql");//-->graphql module to work with GraphQL types
const resolver = require("../resolver/users");//-->Getting resolve functions for respective user query & mutation
const {GraphQLObjectType,GraphQLString,GraphQLList} = graphql;//-->Using graphql data types

//Creating User Type 
const UserType = new GraphQLObjectType({
    name:"User",
    fields:()=>({
        id:{type:GraphQLString},
        name:{type:GraphQLString},
        email:{type:GraphQLString},
        profile_url:{type:GraphQLString},
        intrest:{type:GraphQLList(GraphQLString)},
        saved:{type:GraphQLList(GraphQLString)},
    }),
});

//Initializing all user queries to userQuery
const userQuery = {
    //Get User Details Query
    getUserDetail:{
        type:UserType,
        args:{id:{type:GraphQLString}},
        async resolve(parent,args){
            return await resolver.userdetails(args.id);
         }
    },
}
//Initializing all user mutations to userMutation
const userMutation ={
    //Add User Mutation
    addUser:{
        type:UserType,
        args:{
            uid:{type:GraphQLString},
            name:{type:GraphQLString},
            email:{type:GraphQLString},
            profile_url:{type:GraphQLString},
        },
        async resolve(parent,args){
            return await resolver.adduser(args.uid,args.name,args.email,args.profile_url);
        }
    },
    //Add Intrest Mutation
    addIntrest:{
        type:UserType,
        args:{
            uid:{type:GraphQLString},
            intrest:{type:GraphQLList(GraphQLString)},
        },
        async resolve(parent,args){
            return await resolver.addintrest(args.uid,args.intrest,args.intrest.length,args.intrest.length);
        }
    },
    //Add Saved Article Mutation
    addSavedArticle:{
        type:UserType,
        args:{
            uid:{type:GraphQLString},
            articles:{type:GraphQLList(GraphQLString)},
        },
        async resolve(parent,args){
            return await resolver.addtosaved(args.uid,args.articles,args.articles.length,args.articles.length);
        }
    }
}

//Exporting User Schema
module.exports ={
    userQueries:userQuery,//-->Exporting User Query
    userMutations:userMutation//-->Exporting User Mutation
}