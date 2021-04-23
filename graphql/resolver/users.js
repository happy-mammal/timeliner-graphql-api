const firebase = require("firebase");
const {fbconfig} = require("../../config");
const sizeOf = require("firestore-size");
require("firebase/firestore");
require("firebase/database");

const intreststore = firebase.firestore().collection("intreststore");
const savedstore = firebase.firestore().collection("savedstore");
const database = firebase.database().ref();

async function getUserDetails(id){
    let iskeys=[],sakeys=[],data={};

    const user = await database.child(`users/${id}`).once("value");
    const istores = await database.child(`users/${id}/intreststores`).once("value");
    const sstores = await database.child(`users/${id}/savedstores`).once("value");

    user.exists()?data = await user.val():null;
    istores.exists()?iskeys = Object.keys(await data.intreststores):[];
    sstores.exists()?sakeys = Object.keys(await data.savedstores):[];

    let intrests=[],saves=[];
    
    for(let i=0;i<iskeys.length;i++){
        const data = await intreststore.doc(iskeys[i]).get();
        intrests = await data.data().users[`${id}`]
    }

    for(let i=0;i<sakeys.length;i++){
        const data = await savedstore.doc(sakeys[i]).get();
        saves = await data.data().users[`${id}`]
    }


    return {
        id:data.id,
        name:data.name,
        email:data.email,
        profile_url:data.profile_url,
        intrest:intrests,
        saved:saves,
    };
}

async function addUser(uid,name,email,profile){
    return await database.child(`users/${uid}`).set({
        id:uid,
        name:name,
        email:email,
        profile_url:profile,
        intreststores:{},
        savededstores:{},
    }).then(async()=>{
        return await getUserDetails(uid);
    }).catch(async (err)=>{
        return `FAILED${err}`;
    });
}

async function addIntrest(uid,intrest){
    const currentstore = await getCurrentStore(intreststore,"intrestpointer");
    const storeSize = await getStoreSize(intreststore,currentstore);
    const available = 900000-storeSize;
    const dataSize = sizeOf(intrest);

    if(available<=500){
        console.log(`NO ENOUGH SPACE AVAILABLE. CREATING NEW STORE...`);
        const newstore = await createNewStore(intreststore,"intrestpointer");
        await database.child(`users/${uid}`).update({
            intreststores:{[`${newstore}`]:true}
        });
        addIntrest(uid,intrest);
    }else{
        if(dataSize<=available){
            return await intreststore.doc(currentstore).update({
                [`users.${uid}`]:firebase.firestore.FieldValue.arrayUnion(intrest),
            }).then(async()=>{
                console.log(`SUCCESS [INTREST.]=>${intrest}`);
                await database.child(`users/${uid}`).update({
                    intreststores:{[`${currentstore}`]:true}
                });
                const res = await intreststore.doc(currentstore).get();
            
                return {intrests:await res.data().users[`${uid}`]};
                
            }).catch((err)=>{
                console.log(`FAILURE [ERROR.]=>${err}`);
            });
            
        }
    }
}

async function addSavedArticle(uid,articleId){
    const currentstore = await getCurrentStore(savedstore,"savedpointer");
    const storeSize = await getStoreSize(savedstore,currentstore);
    const available = 900000-storeSize;
    const dataSize = sizeOf(articleId);

    if(available<=500){
        console.log(`NO ENOUGH SPACE AVAILABLE. CREATING NEW STORE...`);
        const newstore = await createNewStore(savedstore,"savedpointer");
        await database.child(`users/${uid}`).update({
            savedstores:{[`${newstore}`]:true}
        });
        addSavedArticle(uid,articleId);
    }else{
        if(dataSize<=available){
            return await savedstore.doc(currentstore).update({
                [`users.${uid}`]:firebase.firestore.FieldValue.arrayUnion(articleId),
            }).then(async()=>{
                console.log(`SUCCESS [SAVED ARTICLE.]=>${articleId}`);
                await database.child(`users/${uid}`).update({
                    savedstores:{[`${currentstore}`]:true}
                });
                const res = await savedstore.doc(currentstore).get();
            
                return {saved:await res.data().users[`${uid}`]};
                
            }).catch((err)=>{
                console.log(`FAILURE [ERROR.]=>${err}`);
            });    
        }
    }
}

//HELPER FUNCTIONS--------------------------------------------
async function getCurrentStore(store,pointer){
    const doc = await store.doc(pointer).get();
    return doc.data().current;
}

async function getStoreSize(store,current){
    const doc = await store.doc(current).get();
    return sizeOf(doc.data());
}

async function createNewStore(store,pointer){
    return await store.add({
        users:{},
    })
    .then((doc)=>{
        console.log(`NEW STORE CREATED SUCCESSFULLY ${doc.id}`);
        store.doc(pointer).update({
            current:doc.id,
            stores:firebase.firestore.FieldValue.arrayUnion(doc.id),
        }).then(()=>{
            console.log(`NEW STORE UPDATED IN POINTER SUCCESSFULLY`);
        }).catch((err)=>{
            console.log(`NEW STORE UPDATED IN POINTER FAILED ${err}`);
        });
        return doc.id;
    }).catch((err)=>{
        console.log(`NEW STORE CREATED FAILED ${err}`);
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
    userdetails:getUserDetails,
    adduser:addUser,
    addintrest:addIntrest,
    addtosaved:addSavedArticle
}
