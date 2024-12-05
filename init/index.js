const Listing = require('../models/listing');
const initData = require('./data')

const mongoose= require('mongoose');

const mongoUrl='mongodb://127.0.0.1:27017/wanderlust'
async function main(){
    await mongoose.connect(mongoUrl);

}

main().then(()=>{console.log('connected')}).catch((err)=>{console.log(err)});

const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj, owner:"67488eb9090e5b5fe48b0830"}));
    await Listing.insertMany(initData.data).then((res)=>{console.log(res)});
    
}

initDB()