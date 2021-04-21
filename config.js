const dotenv = require('dotenv');
dotenv.config();

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MSG_ID,
    appId: process.env.APP_ID
};

const port = process.env.PORT || 3000;

const categories = [process.env.C0,process.env.C1,process.env.C2,process.env.C3,process.env.C4,process.env.C5,process.env.C6];

module.exports ={
    fbconfig:firebaseConfig,
    categories:categories,
    port:port
}