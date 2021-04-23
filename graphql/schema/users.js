const graphql = require("graphql");
const resolver = require("../resolver/users");
const {GraphQLObjectType,GraphQLString,GraphQLList} = graphql;

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

const userQuery = {
    getUserDetail:{
        type:UserType,
        args:{id:{type:GraphQLString}},
        async resolve(parent,args){
            return await resolver.userdetails(args.id);
         }
    },
}

const userMutation ={
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
    addIntrest:{
        type:UserType,
        args:{
            uid:{type:GraphQLString},
            intrest:{type:GraphQLString},
        },
        async resolve(parent,args){
            return await resolver.addintrest(args.uid,args.intrest);
        }
    },
    addSavedArticle:{
        type:UserType,
        args:{
            uid:{type:GraphQLString},
            articleId:{type:GraphQLString},
        },
        async resolve(parent,args){
            return await resolver.addtosaved(args.uid,args.articleId);
        }
    }
}

module.exports ={
    userQueries:userQuery,
    userMutations:userMutation
}