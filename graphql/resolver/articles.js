//Importing modules
const admin = require("firebase-admin");//--> Firebase admin sdk for working with firebase as admin app with serivce-account
const {categories,stories,references,collections,pointers} = require("../../configs/config");//-->Geting requried values/data from config

//Creating firestore instance and collection
const indexstore = admin.firestore().collection(collections[0]);

//Creating realtime database instance and reference
const database = admin.database().ref();

//Get Saved Articles function (Used for getting multiple articles by specifying the ids)
async function getArticlesById(ids){
    let articles = [];
    for(let i=0;i<ids.length;i++){
        const article = await database.child(`${references[0]}/${ids[i]}`).once("value");
        articles.push(article.val());
    }
    return articles;
}
//Get articles function (Used for searching and getting intrest based results)
async function getArticles(query,stores){
var docs = [];
var results = [];

var limit = query.length<20?20/query.length:1;

for(let s = 0;s<stores.length;s++){

var indexes = await indexstore.doc(stores[s]).get();

var keys = Object.keys(await indexes.data().articles);

var data = await indexes.data().articles;

keys.sort();

keys.reverse();

for(let i=0;i<keys.length;i++){
    var keywordsMatch = 0;
    for(let j=0;j<query.length;j++){
        if(data[`${keys[i]}`].includes(query[j])){
            keywordsMatch++;
        }
    }
    if(keywordsMatch>=query.length){
        docs.push(keys[i]);
    }
}

if(docs.length==0){
    if(limit>0){
        for(let j=0;j<query.length;j++){ 
            let noOfMatches = 0;
            for(let i=0;i<keys.length;i++){
                if(data[`${keys[i]}`].includes(query[j])){ 
                    if(noOfMatches!=limit){
                        docs.push(keys[i]);
                        noOfMatches++;
                    }else{
                        break;
                    }
                }
            }
        }
    }
}

for(let i=0;i<docs.length;i++){
    
    const snapshot = await database.child(references[0]).child(docs[i]).once("value");
        
    if (snapshot.exists()) {
        results.push(snapshot.val());
    }
}

}
return results;
}
//Get stories function (Used for getting breaking-news of the day)
async function getStories(){
    let articles =[];
    const breaking = await database.child(references[0]).orderByChild("category").equalTo(stories).limitToLast(10).once("value");
    breaking.forEach((doc)=>{
        articles.push(doc.val());
    });
    return articles;
}
//Get trending function (Used for getting latest article from each category resulting a list of trending)
async function getTrending(){
    let articles=[];
    for(let i=0;i<categories.length;i++){
        const trending = await database.child(references[0]).orderByChild("category").equalTo(categories[i]).limitToLast(1).once("value");
        trending.forEach((doc)=>{
            articles.push(doc.val());
        });
    }
    return articles;
}
//Get latest function (Used for getting 20 latest articles at present)
async function getLatest(){
    let articles =[];
    const latest = await database.child(references[0]).orderByChild("publishedAt").limitToLast(20).once("value");
    latest.forEach((doc)=>{
        articles.push(doc.val());
    });
    return articles;
}
//Get from source function (Used for getting articles based on its source)
async function getFromSource(source,limit){
    let articles = [];
    const article = await database.child(references[0]).orderByChild("source").equalTo(source).limitToLast(limit).once("value");
    article.forEach((doc)=>{
        articles.push(doc.val());
    });
    return articles;
}
//Get from cateogry function (Used for getting articles based on its category)
async function getFromCategory(category,limit){
    let articles = [];
    const article = await database.child(references[0]).orderByChild("category").equalTo(category).limitToLast(limit).once("value");
    article.forEach((doc)=>{
        articles.push(doc.val());
    });
    return articles;
}
//Get Current Index Store function (Provides currently pointed datastore where operations should happen)
async function getCurrentindexstore(){
    const doc = await indexstore.doc(pointers[0]).get();
    return doc.data().stores;
}
//Exporting Articles Resolvers
module.exports={
    byid:getArticlesById,//-->Exporting Get Articles By ID
    search:getArticles,//-->Exporting Get Articles
    stories:getStories,//-->Exporting Get Stories
    trending:getTrending,//-->Exporting Get Trending
    latest:getLatest,//-->Exporting Get Latest
    bysource:getFromSource,//-->Exporting Get From Source
    bycategory:getFromCategory,//-->Exporting Get From Category
    byintrests:getArticles,//-->Exporting Get Articles
    current:getCurrentindexstore//-->Exporting Get Current Index Store
}