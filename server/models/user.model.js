import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum:["instructor", "student"],      // enum is used for multiple role like student , instructor
        default: "student"
    },
    enrolledCourses:[                            // we use array because one user can enroll in multiple courses
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        }
    ],
    photoUrl :{
        type: String,
        default : ""
    }
}, {timestamps: true});


const User = mongoose.model('User', userSchema);

export default User;