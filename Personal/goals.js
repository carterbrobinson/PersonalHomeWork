const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb+srv://CarterSE4200:RVa8oAVNLZzHU1bu@cluster.bfxnrni.mongodb.net/goal?retryWrites=true&w=majority');

const userSchema = new mongoose.Schema ({
    firstName: {
        type: String,
        required: [true, "first name required."]
    },
    lastName: {
        type: String,
        required: [true, "last name required."]
    },
    email: {
        type: String,
        required: [true, "email required."],
        unique: true //not a normal mongoose validator!
    },
    encryptedPassword: {
        type: String,
        required: [true, "password required."]
    }
}, {
    toJSON: {
        versionKey: false,
        transform: function (doc, ret) {
            delete ret.email
            delete ret.encryptedPassword
        }
    }
});


//userSchema.methods.verifyAgeLimit // create as many methods or logic to tack onto the end of your Schema.
//encrypt given plain password and store into database.
//resolve is the then function and reject is the catch function
userSchema.methods.setEncryptedPassword = function (plainPassword) {
    var promise = new Promise((resolve, reject) => {
        bcrypt.hash(plainPassword, 12).then(hash => {
            //set encryptedPassword value on the model instance
            this.encryptedPassword = hash
            //resolve the promise, eventually...
            resolve() //this invokes the caller's then funciton
        })
    })
    return promise
};

userSchema.methods.verifyEncryptedPassword = function (plainPassword) {
    //verify attempted password compare to encrypted/stored password.
    var promise = new Promise((resolve, reject) => {
        console.log(plainPassword)
        console.log(this.encryptedPassword)
        bcrypt.compare(plainPassword, this.encryptedPassword).then((result) => {
            resolve(result)
        })
    })
    return promise
};

const User = mongoose.model('users', userSchema);

const goalSchema = new mongoose.Schema ({
    name: {
        type: String,
        maxLength: 30,
        required: [true, "Name required."]
    },
    myGoal: {
        type: String,
        maxLength: 150,
        required: [true, "Goal name required."]
    },
    frequency: {
        type: String,
        required: [true, "frequency name required."],
        enum: { values: ["Monthly", "Weekly", "Daily", "Twice Daily"], message: "{VALUE} not supported in list."}
    },
    duration: {
        type: String,
        required: [true, "duration for your goal is required."]
    },
    why: {
        type: String,
        maxLength: 500,
        required: [true, "The reason for your goal is required."]
    },
    when: {
        type:String,
        maxLength: 150,
        required: [true, "when you're going to complete your goal required."]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: [true, "Goal must belong to a user"]
    }
});

const goal = mongoose.model('goals', goalSchema);



module.exports = {
    goal: goal, 
    User: User
};