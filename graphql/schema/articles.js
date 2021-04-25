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
        morefromsource:{
            type:GraphQLList(ArticleType),
            args:{source:{type: GraphQLString},limit:{type:GraphQLInt}},
            async resolve(parent,args){
                return await resolver.bysource(args.source,args.limit);
            }
        },
        morefromcategory:{
            type:GraphQLList(ArticleType),
            args:{category:{type: GraphQLString},limit:{type:GraphQLInt}},
            async resolve(parent,args){
                return await resolver.bycategory(args.category,args.limit);
             }
        },
        morefromintrests:{
            type:GraphQLList(ArticleType),
            args:{intrests:{type: GraphQLList(GraphQLString)},limit:{type:GraphQLInt}},
            async resolve(parent,args){
                const current = await resolver.current();
                return await resolver.byintrests(args.intrests,args.limit,current);
            }
        }
    }),
});

//Initializing all article queries to articleQuery
const articleQuery = {
    //Get Stories Query
    getStories:{
        type:GraphQLList(ArticleType),
        async resolve(parent,args){
            return await resolver.stories();
         }
    },
    //Get Treding Query
    getTrending:{
        type:GraphQLList(ArticleType),
        async resolve(parent,args){
            return await resolver.trending();
         }
    },
    //Get Treding Query
    getLatest:{
        type:GraphQLList(ArticleType),
        async resolve(parent,args){
            return await resolver.latest();
        }
    },
    //Get Article Query
    getArticle:{
        type:ArticleType,
        args:{id:{type:GraphQLString}},
        async resolve(parent,args){
            return await resolver.byid(args.id);
        }
    },
    //Get Articles Query
    getArticles:{
        type:GraphQLList(ArticleType),
        args:{term:{type:GraphQLList(GraphQLString)},limit:{type:GraphQLInt}},
        async resolve(parent,args){
           const current = await resolver.current();
           return await resolver.search(args.term,args.limit,current)
        }
    },
    //Get Articles From Source Query
    getArticlesFromSource:{
        type:GraphQLList(ArticleType),
        args:{source:{type: GraphQLString},limit:{type:GraphQLInt}},
        async resolve(parent,args){
            return await resolver.bysource(args.source,args.limit);
         }
    },
    //Get Articles From Category Query
    getArticlesFromCategory:{
        type:GraphQLList(ArticleType),
        args:{category:{type: GraphQLString},limit:{type:GraphQLInt}},
        async resolve(parent,args){
            return await resolver.bycategory(args.category,args.limit);
         }
    },
    //Get Articles From Intrests Query
    getArticlesFromIntrests:{
        type:GraphQLList(ArticleType),
        args:{intrests:{type: GraphQLList(GraphQLString)},limit:{type:GraphQLInt}},
        async resolve(parent,args){
            const current = await resolver.current();
            return await resolver.byintrests(args.intrests,args.limit,current);
        }
    }
}
//Exporting Article Schema
module.exports = {
    articlesQueries:articleQuery//-->Exporting Article Query
}
