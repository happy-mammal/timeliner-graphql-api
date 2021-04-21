const firebase = require("firebase");
const {fbconfig,categories} = require("../../config");
require("firebase/firestore");

firebase.initializeApp(fbconfig);

const indexstore = firebase.firestore().collection("indexes");

const database = firebase.database().ref();

async function getArticleById(id){
    const article = await database.child(`articles/${id}`).once("value");
    return article.val();
}

async function getArticles(query,limit,current){
var docs = [];
var results = [];

const indexes = await indexstore.doc(current).get();

const keys = Object.keys(await indexes.data().articles);

const data = await indexes.data().articles;

for(let i=0;i<keys.length;i++){
    if(data[`${keys[i]}`].includes(query)){
        docs.push(keys[i]);
   }
}
docs.sort();
if(docs.length>limit){
    docs = docs.slice(0,limit);
}
for(let i=0;i<docs.length;i++){
    const snapshot = await database.child("articles").child(docs[i]).once("value");
    if (snapshot.exists()) {
        results.push(snapshot.val());
    }
}

return results;
}

async function getStories(){
    let articles =[];
    const stories = await database.child("articles").orderByChild("category").equalTo("breaking-news").limitToFirst(10).once("value");
    stories.forEach((doc)=>{
        articles.push(doc.val());
    });
    return articles;
}

async function getTrending(){
    let articles=[];
    for(let i=0;i<categories.length;i++){
        const trending = await database.child("articles").orderByChild("category").equalTo(categories[i]).limitToFirst(1).once("value");
        trending.forEach((doc)=>{
            articles.push(doc.val());
        });
    }
    return articles;
}

async function getFromSource(source,limit){
    let articles = [];
    const article = await database.child("articles").orderByChild("source").equalTo(source).limitToFirst(limit).once("value");
    article.forEach((doc)=>{
        articles.push(doc.val());
    });
    return articles;
}

async function getFromIntrests(intrests,limit,current){
    var articles=[];
    
    for(let i=0;i<intrests.length;i++){
        console.log(intrests[i]);
        const data = await getArticles(intrests[i],limit,current);
        articles = articles.concat(data);
    }
    return articles;
}

async function getFromCategory(category,limit){
    let articles = [];
    const article = await database.child("articles").orderByChild("category").equalTo(category).limitToFirst(limit).once("value");
    article.forEach((doc)=>{
        articles.push(doc.val());
    });
    return articles;
}

async function getCurrentindexstore(){
    const doc = await indexstore.doc("indexpointer").get();
    return doc.data().current;
}

module.exports={
    byid:getArticleById,
    search:getArticles,
    stories:getStories,
    trending:getTrending,
    bysource:getFromSource,
    bycategory:getFromCategory,
    byintrests:getFromIntrests,
    current:getCurrentindexstore
}