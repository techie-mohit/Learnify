import { CourseProgress } from "../models/courseProgress.model.js";
import { Course } from "../models/course.model.js";


export const getCourseProgress = async(req, res)=>{
    try {
        const {courseId} = req.params;
        const userId = req.id;

        // step-1 fetch the user Course Progress
         let courseProgress = await CourseProgress.findOne({courseId, userId}).populate("courseId");

         const courseDetail = await Course.findById(courseId).populate("lectures");

         if(!courseDetail){
            return res.status(404).json({
                message:"Course Not found"
            })
         }

         // step-2 if no progress, return course Details with an empty progress
         if(!courseProgress){
            return res.status(200).json({
                data:{
                    courseDetail,
                    progress:[],
                    completed:false
                }
            })
         }

        //  step-3 Return the user course progress along with course Details
        return res.status(200).json({
            data:{
                courseDetail,
                progress:courseProgress.lectureProgress,
                completed:courseProgress.completed,
            }
        })



        
    } catch (error) {
        console.log(error);
        
    }
}

export const updateLectureProgress = async(req,res)=>{
    try {
        const {courseId, lectureId}= req.params;
        const userId = req.id;

        // fetch or create course Progress
        let courseProgress = await CourseProgress.findOne({courseId, userId});

        if(!courseProgress){

            // if no progress exist then create a new record

            courseProgress = new CourseProgress({
                userId,
                courseId,
                completed:false,
                lectureProgress:[]
            });
            
         }

         // find the lecture progress in the course progress
         const lectureIndex = courseProgress.lectureProgress.findIndex((lecture)=>lecture.lectureId === lectureId);

         if(lectureIndex !== -1){
            // if the lecture already exist , update its status
            courseProgress.lectureProgress[lectureIndex].viewed = true;
         }
         else{
            // if lectureIndex not exist
            // add new Lectures
            courseProgress.lectureProgress.push({lectureId, viewed:true});
         }

        //  if all lecture completed
        const lectureProgressLength = courseProgress.lectureProgress.filter((lectureProg)=> lectureProg.viewed).length;
        
        const course = await Course.findById(courseId);

        if(course.lectures.length === lectureProgressLength) courseProgress.completed = true;

        await courseProgress.save();

        return res.status(200).json({
            message: "lecture progress updated Successfully"
        })



    } catch (error) {
        console.log(error);
    }
}


export const markAsCompleted = async (req, res)=>{
    try {

        const {courseId} = req.params;
        const userId = req.id;
        const courseProgress = await CourseProgress.findOne({courseId, userId});
        if(!courseProgress){
            return res.status(404).json({message:"Course Progress Not Found"});
        }

        courseProgress.lectureProgress.map((lectureProgress)=> lectureProgress.viewed = true);

        courseProgress.completed = true;

        await courseProgress.save();
        return res.status(200).json({message:"Course marked as Completed"})

        
    } catch (error) {
        console.log(error);
    }
}



export const markAsInCompleted = async (req, res)=>{
    try {

        const {courseId} = req.params;
        const userId = req.id;
        const courseProgress = await CourseProgress.findOne({courseId, userId});
        if(!courseProgress){
            return res.status(404).json({message:"Course Progress Not Found"});
        }

        courseProgress.lectureProgress.map((lectureProgress)=> lectureProgress.viewed = false);

        courseProgress.completed = false;

        await courseProgress.save();
        return res.status(200).json({message:"Course marked as InCompleted"})

        
    } catch (error) {
        console.log(error);
    }
}