![Heroku](https://heroku-badge.herokuapp.com/?app=heroku-badge)

# timeliner-graphql-api
This is a GraphQL API service for TimeLiner Application created with Node.js & Express framework using Firebase Firestore and Realtime DB as backend hosted on Heroku. 
 - API Endpoint: https://timeliner-gql-api.herokuapp.com/api

## Implementations
  - Firebase Admin SDK (firebase-admin)
  - Express as HTTP Framework (express)
  - Express GraphQL to create GraphQL server by adding as middleware to Express route (express-graphql)
  - Firestore Size (firestore-size)
  - GraphQL as Query Language (graphql)
  - Nodemon for automatic restaring and smooth use (nodemon)
  - Used Envirnoment Variables where ever possible (dotenv)

## Objects/Types
Objects in GraphQL represent the resources you can access. An object can contain a list of fields, which are specifically typed.
  - ### Article (Represents Article Information such as title,description, etc.)
      - id: String  (Article's ID)
      - title: String  (Article's Title)
      - description: String (Article's Description)
      - content: String (Article's Content)
      - url: String (Article's URL)
      - image: String (Article's Image URL)
      - publishedAt: String (Article's Published Date and Time)
      - source: String (Article's Source's Name)
      - source_url: String (Article's Source's URL)
      - category: String (Article's Category)
      - keywords: [String] (Article's Keywords/Tags)
   
   - ### User (Represents User Information such as userId,intrests, etc)
      - userId: String  (User's ID)
      - intrests: [String]  (List of user's intrests)
      - saves: [String] (List of user's saved articles ids)
      - istores: [String] (List of user's intrest stores)
      - sstores: [String] (List of user's saves stores)
      
    
## Queries
Every GraphQL schema has a root type for both queries and mutations. The query type defines GraphQL operations that retrieve data from the server.
   - ### getStories (Type: Article) [Returns Maximum of 10 current latest stories]
       - Arguments (None)
   - ### getTrending (Type: Article) [Returns Maximum of 10 treding articles each from the available categories]
       - Arguments (None)
   - ### getLatest (Type: Article) [Returns Maximum of 20 current latest articles]
       - Arguments (None)
   - ### getArticlesById (Type: Article) [Returns List of Articles based on the number of articleIds passed as an arguments]
       - Arguments (ArticleIds:[String])
   - ### getArticlesByTerm (Type: Article) [Returns List of Articles based on the search terms/keywords passed as an arguments]
       - Arguments (terms:[String])
   - ### getArticlesFromSource (Type: Article) [Returns List of Articles published by source specided as an argument with maximum results specified as limit argument]
       - Arguments (source:String,limit:Int)
   - ### getArticlesFromCategory (Type: Article) [Returns List of Articles by category specided as an argument with maximum results specified as limit argument]
       - Arguments (category:String,limit:Int)
   - ### getUserDetails (Type: User) [Returns Details of user by id specified as an argument]
       - Arguments (userId:String)

## Mutations
Every GraphQL schema has a root type for both queries and mutations. The mutation type defines GraphQL operations that change data on the server. It is analogous to performing HTTP verbs such as POST, PATCH, and DELETE.

   - ### addUser (Type: User) [Creates New User]
       - Inputs (userId:String)
   - ### addIntrests (Type: User) [Adds User's Intrests]
       - Inputs (userId:String, intrests:[String])
   - ### addSaves (Type: User) [Adds User's Saved Article's Ids]
       - Inputs (userId:String, saves:[String])
   - ### removeIntrests (Type: User) [Removes User's Intrests]
       - Inputs (userId:String, intrests:[String], stores:[String])
   - ### removeSaves (Type: User) [Removes User's Saved Article's Ids]
       - Inputs (userId:String, saves:[String], stores:[String])

## Folder Structure
```
.
├── configs
│   └── config.js
├── graphql
│   ├── resolver
│   │   ├── articles.js
│   │   └── users.js
│   ├── schema
│   │   ├── articles.js
│   │   ├── index.js
│   │   └── users.js
│   └── index.js
├── .env
├── .gitignore
├── LICENSE
├── package-lock.json
├── package.json
├── Procfile
├── README.md
└── server.js
```

## Techs Used
  - Firebase
  - GraphQL
  - Node Express
  - Heroku

## License
 <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/1200px-MIT_logo.svg.png" width="200" height="100"/>
