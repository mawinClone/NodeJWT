const mongoose = require('mongoose');
const {MONGO_URI} = process.env;

exports.connect = () =>{
    mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,

    })
    .then(()=>{
        console.log("connected db success");
    })
    .catch((err)=>{
        console.error(err);
        process.exit(1);
    });
}