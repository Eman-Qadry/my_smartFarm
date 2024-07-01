const mongodb=require("mongodb");
const mongoclient=mongodb.MongoClient;
//const db=process.env.DATABASE.Replace('<password>',process.env.PASSWORD);
function getconnect(callback){
    mongoclient.connect('mongodb+srv://wafaakadry756:8xp7ynrC3Y91E7Q0@wafaaa.srergbn.mongodb.net/grad_project?retryWrites=true&w=majori')
    .then(client=>{
        callback (client);
    })
    .catch(err=>{
        throw err;
    });
};
module.exports=getconnect;