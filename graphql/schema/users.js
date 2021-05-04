//Importing modules
const graphql = require("graphql");//-->graphql module to work with GraphQL types
const resolver = require("../resolver/users");//-->Getting resolve functions for respective user query & mutation
const {GraphQLObjectType,GraphQLString,GraphQLList} = graphql;//-->Using graphql data types

//Creating User Type 
const UserType = new GraphQLObjectType({
    name:"User",
    fields:()=>({
        userId:{type:GraphQLString},
        istores:{type:GraphQLList(GraphQLString)},
        sstores:{type:GraphQLList(GraphQLString)},
        intrests:{type:GraphQLList(GraphQLString)},
        saves:{type:GraphQLList(GraphQLString)},
    }),
});

//Initializing all user queries to userQuery
const userQuery = {
    //Get User Details Query
    getUserDetails:{
        type:UserType,
        args:{
            userId:{type:GraphQLString},
        },
        async resolve(parent,args){
            return await resolver.getuserdetails(args.userId);
         },
    },
};

//Initializing all user mutations to userMutation
const userMutation ={
    //Add User Mutation
    addUser:{
        type:UserType,
        args:{
            userId:{type:GraphQLString},
        },
        async resolve(parent,args){
            return await resolver.adduser(args.userId);
        },
    },
    //Add Intrests Mutation
    addIntrests:{
        type:UserType,
        args:{
            userId:{type:GraphQLString},
            intrests:{type:GraphQLList(GraphQLString)},
        },
        async resolve(parent,args){
            return await resolver.addintrests(args.userId,args.intrests,args.intrests.length,args.intrests.length);
        },
    },
    //Add Saves Mutation
    addSaves:{
        type:UserType,
        args:{
            userId:{type:GraphQLString},
            articleIds:{type:GraphQLList(GraphQLString)},
        },
        async resolve(parent,args){
            return await resolver.addsaves(args.userId,args.articleIds,args.articleIds.length,args.articleIds.length);
        },
    },
    //Remove Intrests Mutation
    removeIntrests:{
        type:UserType,
        args:{
            userId:{type:GraphQLString},
            intrests:{type:GraphQLList(GraphQLString)},
            stores:{type:GraphQLList(GraphQLString)},
        },
        async resolve(parent,args){
            return await resolver.removeintrests(args.userId,args.intrests,args.stores);
        },
    },
    //Remove Saves Mutation
    removeSaves:{
        type:UserType,
        args:{
            userId:{type:GraphQLString},
            articleIds:{type:GraphQLList(GraphQLString)},
            stores:{type:GraphQLList(GraphQLString)},
        },
        async resolve(parent,args){
            return await resolver.removesaves(args.userId,args.articleIds,args.stores);
        },
    },
}

//Exporting User Schema
module.exports ={
    userQueries:userQuery,//-->Exporting User Query
    userMutations:userMutation//-->Exporting User Mutation
}