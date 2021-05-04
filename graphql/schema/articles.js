//Add User Mutation
const graphql = require("graphql");//-->graphql module to work with GraphQL types
const resolver = require("../resolver/articles");//-->Getting resolve functions for respective article query
const {GraphQLObjectType,GraphQLString,GraphQLList,GraphQLInt} = graphql;//-->Using graphql data types

//Creating User Type 
const ArticleType = new GraphQLObjectType({
    name:'Article',
    fields:()=>({
        id: {type: GraphQLString},
        title: {type: GraphQLString},
        description: {type: GraphQLString},
        content: {type: GraphQLString},
        url: {type: GraphQLString},
        image: {type: GraphQLString},
        publishedAt: {type: GraphQLString},
        source: {type: GraphQLString},
        source_url: {type: GraphQLString},
        category: {type: GraphQLString},
        keywords:{type: GraphQLList(GraphQLString)},
    }),
});

//Initializing all article queries to articleQuery

const articleQuery = {
    //Get Stories Query
    getStories:{
        type:GraphQLList(ArticleType),
        async resolve(parent,args){
            return await resolver.stories();
         },
    },
    //Get Treding Query
    getTrending:{
        type:GraphQLList(ArticleType),
        async resolve(parent,args){
            return await resolver.trending();
         },
    },
    //Get Treding Query
    getLatest:{
        type:GraphQLList(ArticleType),
        async resolve(parent,args){
            return await resolver.latest();
        },
    },
    //Get Articles By Id Query
    getArticlesById:{
        type:GraphQLList(ArticleType),
        args:{
            articleIds:{type:GraphQLList(GraphQLString)},
        },
        async resolve(parent,args){
            return await resolver.byid(args.articleIds);
        },
    },
    //Get Articles By Term Query
    getArticlesByTerm:{
        type:GraphQLList(ArticleType),
        args:{
            terms:{type:GraphQLList(GraphQLString)},
        },
        async resolve(parent,args){
           const current = await resolver.current();
           
           return await resolver.search(args.terms,current)
        },
    },
    //Get Articles From Source Query
    getArticlesFromSource:{
        type:GraphQLList(ArticleType),
        args:{
            source:{type: GraphQLString},
            limit:{type:GraphQLInt},
        },
        async resolve(parent,args){
            return await resolver.bysource(args.source,args.limit);
         },
    },
    //Get Articles From Category Query
    getArticlesFromCategory:{
        type:GraphQLList(ArticleType),
        args:{
            category:{type: GraphQLString},
            limit:{type:GraphQLInt},
        },
        async resolve(parent,args){
            return await resolver.bycategory(args.category,args.limit);
         },
    },
}
//Exporting Article Schema
module.exports = {
    articlesQueries:articleQuery//-->Exporting Article Query
}
