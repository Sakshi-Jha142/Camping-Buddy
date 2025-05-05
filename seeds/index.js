const mongoose = require('mongoose');
const cities = require('./cities');
const {places , descriptors} = require('./seedHelpers');
const Campground = require('../models/campground')

// databse connection.....
mongoose.connect('mongodb://localhost:27017/yelp-camp')
    .then(()=>{
         console.log('database connected');
    })
    .catch(err=>{
        console.log(err);
    })


const sample = array =>array[Math.floor(Math.random() * array.length)];
 




const seedDB = async ()=>{
    await Campground.deleteMany({});
    for(let i=0;i<50;i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() *20) + 10;
        const camp = new Campground({
            author: '6342de02938cece5e967a0c9',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)} `,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reiciendis, repellendus. Nihil quod asperiores ullam cum atque, illum modi blanditiis officia!',
            price
        })
        await camp.save();
    }
}

seedDB();
