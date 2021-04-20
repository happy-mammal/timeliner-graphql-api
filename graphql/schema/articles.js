const graphql = require("graphql");
const resolver = require("../resolver/articles");
const {GraphQLObjectType,GraphQLString,GraphQLList,GraphQLInt} = graphql;

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

const articleQuery = {
    getStories:{
        type:GraphQLList(ArticleType),
        async resolve(parent,args){
            return await resolver.stories()
         }
    },
    getTrending:{
        type:GraphQLList(ArticleType),
        async resolve(parent,args){
            return await resolver.trending()
         }
    },
    getArticle:{
        type:ArticleType,
        args:{id:{type:GraphQLString}},
        async resolve(parent,args){
            return await resolver.byid(args.id);
        }
    },
    getArticles:{
        type:GraphQLList(ArticleType),
        args:{term:{type:GraphQLString},limit:{type:GraphQLInt}},
        async resolve(parent,args){
           const current = await resolver.current();
           return await resolver.search(args.term,args.limit,current)
        }
    },
    getArticlesFromSource:{
        type:GraphQLList(ArticleType),
        args:{source:{type: GraphQLString},limit:{type:GraphQLInt}},
        async resolve(parent,args){
            return await resolver.bysource(args.source,args.limit);
         }
    },
    getArticlesFromCategory:{
        type:GraphQLList(ArticleType),
        args:{category:{type: GraphQLString},limit:{type:GraphQLInt}},
        async resolve(parent,args){
            return await resolver.bycategory(args.category,args.limit);
         }
    },
    getArticlesFromIntrests:{
        type:GraphQLList(ArticleType),
        args:{intrests:{type: GraphQLList(GraphQLString)},limit:{type:GraphQLInt}},
        async resolve(parent,args){
            const current = await resolver.current();
            return await resolver.byintrests(args.intrests,args.limit,current);
        }
    }
}

module.exports = {
    articlesQueries:articleQuery
}
