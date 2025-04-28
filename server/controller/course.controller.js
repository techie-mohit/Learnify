import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import { deleteMedia, deleteVideo, uploadMedia } from "../utils/cloudinary.js";
import mongoose from "mongoose";

export const createCourse = async (req, res) => {
  try {
    const { courseTitle, category } = req.body;
    if (!courseTitle || !category) {
      return res.status(400).json({
        message: "courseTitle and category are required",
      });
    }

    const course = await Course.create({
      courseTitle,
      category,
      creator: req.id,
    });

    return res.status(201).json({
      course,
      message: "Course created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to create course",
    });
  }
};

export const searchCourse = async(req, res)=>{
  try {
    const {query="", categories = [], sortByPrice="" } = req.query;
    // create search Query
    const searchCriteria = {
      isPublished:true,
      $or:[
        {courseTitle: {$regex:query, $options:"i"}},
        {subTitle: {$regex:query, $options:"i"}},
        {category: {$regex:query, $options:"i"}}
      ]  
    }

    // if categories are selected
    if(categories.length >0 ){
      searchCriteria.category = {$in: categories};
    }

    // define sorting order

    const sortOptions= {};
    if(sortByPrice === 'low'){
      sortOptions.coursePrice = 1;  // sort by price in ascending order
    }
    else if(sortByPrice === "high"){
      sortOptions.coursePrice = -1;  // sort by price in descendind order 
    }

    let courses = await Course.find(searchCriteria).populate({path:"creator", select:"name photoUrl"}).sort(sortOptions);

    return res.status(200).json({
      success:true,
      courses:courses || []
    });
    
  } catch (error) {
    console.log(error);
  }
}

export const getPublishedCourse = async(req,res)=>{
  try {
    const courses = await Course.find({isPublished:true}).populate({path:"creator", select:"name photoUrl"});
    if(!courses){
      return res.status(404).json({
        message:"Course Not Found"
      })
    }
    return res.status(200).json({
      courses,
    })
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to get published courses",
    });
    
  }
}

export const getCreatorCourses = async (req, res) => {
  try {
    const userId = req.id;
    const courses = await Course.find({ creator: userId });
    if (!courses) {
      return res.status(400).json({
        courses: [],
        message: "courses not found",
      });
    }
    return res.status(200).json({
      courses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to create Course",
    });
  }
};

export const editCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
    } = req.body;
    const thumbnail = req.file;

    let course = await Course.findById(courseId);
    if (!course) {
      return res.status(400).json({
        message: "Course Not Found",
      });
    }

    let courseThumbnail;
    if (thumbnail) {
      if (course.courseThumbnail) {
        const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
        console.log("publicId", publicId);
        await deleteMedia(publicId); // delete all images
      }
      // upload thumbnail on cloudinary

      courseThumbnail = await uploadMedia(thumbnail.path);
    }

    const updateData = {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
      courseThumbnail: courseThumbnail?.secure_url,
    };
    course = await Course.findByIdAndUpdate(courseId, updateData, {
      new: true,
    });

    return res.status(200).json({
      course,
      message: "Course Updated Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to create Course",
    });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params; // params used to get the id from search bar
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    return res.status(201).json({
      course,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to get course by id",
    });
  }
};

export const createLecture = async (req, res) => {
  try {
    const { lectureTitle } = req.body;

    const { courseId } = req.params;

    if (!lectureTitle) {
      return res.status(400).json({
        message: "LectureTitle  and is required ",
      });
    }

    const lecture = await Lecture.create({ lectureTitle });

    const course = await Course.findById(courseId);
    if (course) {
      course.lectures.push(lecture._id);
      await course.save();
    }

    return res.status(201).json({
      lecture,
      message: "Lecture created Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to create Lecture",
    });
  }
};

export const getCourseLecture = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate("lectures"); // populate ki wajah se course variable ke andar lectures me jo aayrga data vo course me aa jayega
    if (!course) {
      return res.status(400).json({
        message: "course not found",
      });
    }

    return res.status(200).json({
      lectures: course.lectures,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to get course lecture ",
    });
  }
};

export const editLecture = async (req, res) => {
  try {
    const { lectureTitle, videoInfo, isPreviewFree } = req.body;

    const { courseId, lectureId } = req.params;
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({
        message: "Lecture Not Found",
      });
    }

    // update Lecture

    if (lectureTitle) {
      lecture.lectureTitle = lectureTitle;
    }
    if (videoInfo?.videoUrl) {
      lecture.videoUrl = videoInfo.videoUrl;
    }
    if (videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
    lecture.isPreviewFree = isPreviewFree;

    await lecture.save();

    // ensure the course still has the lecture Id if it was not already added;
    const course = await Course.findById(courseId);
    if (course && !course.lectures.includes(lecture._id)) {
      course.lectures.push(lecture._id);
      await course.save();
    }
    return res.status(200).json({
      lecture,
      message: "Lecture updated Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Faied to edit lecture",
    });
  }
};

export const removeLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findByIdAndDelete(lectureId);
    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found",
      });
    }

    // delete the lecture from cloudinaryas well

    if (lecture.publicId) {
      await deleteVideo(lecture.publicId);
    }

    // remove the lecture reference from the associated course
    await Course.updateOne(
      { lectures: lectureId }, // find the course that contains the particular lecture
      { $pull: { lectures: lectureId } } // remove the lecture id from the lectures array
    );

    return res.status(200).json({
      message: "Lecture removed Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Faied to remove lecture",
    });
  }
};

export const getLectureById = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found",
      });
    }
    return res.status(200).json({
      lecture,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Faied to get lecture by id",
    });
  }
};



// publish unpublish the lecture

export const togglePublishCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { publish } = req.query; // true, false

    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "course not found",
      });
    }
    //published status based on query parameter
    course.isPublished = publish === "true";
    await course.save();

    const statusMessage = course.isPublished ? "Published" : "UnPublished";
    return res.status(200).json({
      message: `Course is ${statusMessage}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Faied to update status",
    });
  }
};
