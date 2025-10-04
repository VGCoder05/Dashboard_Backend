const mongoose = require("mongoose")

const db= ()=>{
        mongoose
          .connect(process.env.MongoDB_URL)
          .then(() => {
            console.log("Connect hogya");
          })
          .catch((err) => {
            console.log("Connect nhi hua : ", err);
          });
}

module.exports = db;


// want to add setup backend, install packages