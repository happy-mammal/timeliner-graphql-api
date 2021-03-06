//Importing modules
const admin = require("firebase-admin");//--> Firebase admin sdk for working with firebase as admin app with serivce-account
const sizeOf = require("firestore-size");//-->Used for performing size calulations on data and documents
const {references,collections,pointers} = require("../../configs/config");//-->Geting requried values/data from config

//Creating firestore instance and collection
const intreststore = admin.firestore().collection(collections[1]);//-->Intrest Store Collection
const savedstore = admin.firestore().collection(collections[2]);//-->Saved Store Collection

//Creating realtime database instance and reference
const database = admin.database().ref();

//Get User Details function (Used for getting user details)
async function getUserDetails(id){
    let iskeys=[],sakeys=[],data={};

    const user = await database.child(`${references[1]}/${id}`).once("value");
    const istores = await database.child(`${references[1]}/${id}/${collections[1]}`).once("value");
    const sstores = await database.child(`${references[1]}/${id}/${collections[2]}`).once("value");
    
    user.exists()?data = await user.val():null;
    istores.exists()?iskeys = Object.keys(await data[`${collections[1]}`]):[];
    sstores.exists()?sakeys = Object.keys(await data[`${collections[2]}`]):[];

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
        userId:data.id,
        istores: iskeys,
        sstores: sakeys,
        intrests:intrests,
        saves:saves,
    };
}
//Add User function (Used for adding new user)
async function addUser(uid){
    return await database.child(`${references[1]}/${uid}`).set({
        id:uid,
        [`${collections[1]}`]:{},
        [`${collections[2]}`]:{},
    }).then(async()=>{
        return await getUserDetails(uid);
    }).catch(async (err)=>{
        return `FAILED${err}`;
    });
}
//Add Intrests function (Used for adding new intrests in intrests list of the specified user)
async function addIntrests(uid,intrests,length,totalLength){

    const currentstore = await getCurrentStore(intreststore,pointers[1]);
    const storeSize = await getStoreSize(intreststore,currentstore);
    const available = 900000-storeSize;
    const dataSize = sizeOf(intrests);

    if(available<=500){
        console.log(`NO ENOUGH SPACE AVAILABLE. CREATING NEW STORE...`);
        const newstore = await createNewStore(intreststore,pointers[1]);
        await database.child(`${references[1]}/${uid}`).update({
            [`${collections[1]}`]:{[`${newstore}`]:true}
        });
        addIntrests(uid,intrests,length,totalLength);
    }else{
        if(dataSize<=available){
            for(var i=0;i<length;i++){
            await intreststore.doc(currentstore).update({
                [`users.${uid}`]:admin.firestore.FieldValue.arrayUnion(intrests[i]),
            }).then(async()=>{
                console.log(`SUCCESS [INTREST.]=>${intrests[i]}`);
                await database.child(`users/${uid}`).update({
                    [`${collections[1]}`]:{[`${currentstore}`]:true}
                });      
            }).catch((err)=>{
                console.log(`FAILURE ADD [ERROR.]=>${err}`);
            });

            }
            if(totalLength>length){
                intrests = intrests.slice(length,totalLength);
                addIntrests(uid,intrests,intrests.length,totalLength);
            }else{
                return getUserDetails(uid);
            }
        }else{
            addIntrests(uid,intrests,(intrests.length)/2,intrests.length);
        }
    }

}
//Add Saves function (Used for adding new articles in saves list of the specified user)
async function addSaves(uid,articles,length,totalLength){
    const currentstore = await getCurrentStore(savedstore,pointers[2]);
    const storeSize = await getStoreSize(savedstore,currentstore);
    const available = 900000-storeSize;
    const dataSize = sizeOf(articles);

    if(available<=500){
        console.log(`NO ENOUGH SPACE AVAILABLE. CREATING NEW STORE...`);
        const newstore = await createNewStore(savedstore,pointers[2]);
        await database.child(`${references[1]}/${uid}`).update({
            [`${collections[2]}`]:{[`${newstore}`]:true}
        });
        addSavedArticle(uid,articled,length,totalLength);
    }
    else{
        if(dataSize<=available){
            for(var i=0;i<length;i++){
                await savedstore.doc(currentstore).update({
                    [`users.${uid}`]:admin.firestore.FieldValue.arrayUnion(articles[i]),
                }).then(async()=>{
                    console.log(`SUCCESS [SAVED ARTICLE.]=>${articles[i]}`);
                    await database.child(`${references[1]}/${uid}`).update({
                        [`${collections[2]}`]:{[`${currentstore}`]:true}
                    });
                }).catch((err)=>{
                    console.log(`FAILURE [ERROR.]=>${err}`);
                });   
            } 

            if(totalLength>length){
                articles = articles.slice(length,totalLength);
                addSavedArticle(uid,articles,articles.length,totalLength);
            }else{
                return getUserDetails(uid);
            }
        }
        else{
            addSavedArticle(uid,articles,(articles.length)/2,articles.length);
        }
    }
}
//Remove Intrests function (Used for removing intrests from the intrests list of the specified user)
async function removeIntrests(uid,intrests,stores){
    for(let i =0;i<stores.length;i++){
        for(let j=0;j<intrests.length;j++){
            await intreststore.doc(stores[i]).update({
                [`users.${uid}`]:admin.firestore.FieldValue.arrayRemove(intrests[j]),
            }).then(async()=>{
                console.log(`SUCCESS [INTREST REMOVED.]=>${intrests[i]}`);
                await database.child(`users/${uid}`).update({
                    [`${collections[1]}`]:{[`${stores[i]}`]:true}
                });      
            }).catch((err)=>{
                console.log(`FAILURE REMOVE [ERROR.]=>${err}`);
            });
        }
    }
    return getUserDetails(uid);
}
//Remove Saves function (Used for removing articles from the saves list of the specified user)
async function removeSaves(uid,saves,stores){
    for(let i =0;i<stores.length;i++){
        for(let j=0;j<saves.length;j++){
            await savedstore.doc(stores[i]).update({
                [`users.${uid}`]:admin.firestore.FieldValue.arrayRemove(saves[j]),
            }).then(async()=>{
                console.log(`SUCCESS [SAVES REMOVED.]=>${intrests[i]}`);
                await database.child(`users/${uid}`).update({
                    [`${collections[2]}`]:{[`${stores[i]}`]:true}
                });      
            }).catch((err)=>{
                console.log(`FAILURE REMOVE [ERROR.]=>${err}`);
            });
              
        }
    }
    return getUserDetails(uid);
}
//Get Current Store function (Provides currently pointed datastore where operations should happen)
async function getCurrentStore(store,pointer){
    const doc = await store.doc(pointer).get();
    return doc.data().current;
}
//Get Store Size function (Provides currently pointed datastore size)
async function getStoreSize(store,current){
    const doc = await store.doc(current).get();
    return sizeOf(doc.data());
}
//Create New Store function (Creates new datastore in specified collection)
async function createNewStore(store,pointer){
    return await store.add({
        users:{},
    })
    .then((doc)=>{
        console.log(`NEW STORE CREATED SUCCESSFULLY ${doc.id}`);
        store.doc(pointer).update({
            current:doc.id,
            stores:admin.firestore.FieldValue.arrayUnion(doc.id),
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

//Exporting User Resolvers
module.exports = {
    getuserdetails:getUserDetails,//-->Exporting Get User Details
    adduser:addUser,//-->Exporting Add User
    addintrests:addIntrests,//-->Exporting Add Intrests
    addsaves:addSaves,//-->Exporting Add Saves
    removeintrests:removeIntrests,//-->Exporting Remove Intrests
    removesaves:removeSaves,//-->Exporting Remove Saves
}
