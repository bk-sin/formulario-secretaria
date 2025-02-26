const mongoose = require("mongoose")

const URI = process.env.MONGODB_URI 

mongoose.connect(URI, {
    useUnifiedTopology : true,
    useNewUrlParser: true,
})

.then (()=> console.log('Database connected'))
.catch(err => console.error(err))