import BuyCourseButton from "@/components/BuyCourseButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetCourseDetailWithStatusQuery } from "@/features/api/purchaseApi";
import { BadgeInfo, Lock, PlayCircle } from "lucide-react";
import React from "react";
import ReactPlayer from "react-player";
import { useNavigate, useParams } from "react-router-dom";

function CourseDetail() {
  const params = useParams();
  const courseId = params.courseId;
  const navigate = useNavigate();

  const { data, isLoading, isError } =
    useGetCourseDetailWithStatusQuery(courseId);

  if (isLoading) return <h1>Loading ....</h1>;
  if (isError) return <h1>Failed to load Course Details</h1>;

  const { course, purchased } = data;

  const handleContinueCourse = () => {
    if (purchased) {
      navigate(`/course-progress/${courseId}`);
    }
  };

  return (
    <div className="space-y-5 bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors duration-300 min-h-screen">
      
      {/* Header Section */}
      <div className="bg-indigo-50 dark:bg-[#2D2F31] border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 flex-col gap-2">
          <h1 className="font-extrabold text-2xl md:text-3xl text-gray-900 dark:text-white">
            {course?.courseTitle}
          </h1>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300">
            Course sub-title
          </p>
          <p className="mt-1">
            Created By{" "}
            <span className="text-indigo-700 dark:text-[#C0C4FC] underline italic">
              {course?.creator.name}
            </span>
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 mt-2">
            <BadgeInfo size={16} />
            <p>Last Updated {course?.createdAt.split("T")[0]}</p>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mt-1">
            Students Enrolled: {course?.enrolledStudents.length}
          </p>
        </div>
      </div>

      {/* Body Section */}
      <div className="max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10">
        
        {/* Left: Description & Content */}
        <div className="w-full lg:w-2/3 space-y-5">
          <h1 className="font-bold text-xl md:text-2xl">Description</h1>
          <p 
            className="text-sm leading-relaxed text-gray-700 dark:text-gray-300" 
            dangerouslySetInnerHTML={{ __html: course.description }} 
          />
          
          <Card className="bg-white dark:bg-gray-900 dark:border-gray-700 shadow-sm transition-colors">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100">Course Content</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                {course.lectures.length} lectures
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {course.lectures.map((lecture, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-3 text-sm text-gray-800 dark:text-gray-300"
                >
                  <span>
                    {purchased ? <PlayCircle size={16} /> : <Lock size={16} />}
                  </span>
                  <p>{lecture.lectureTitle}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right: Video + Purchase */}
        <div className="w-full lg:w-1/3">
          <Card className="bg-white dark:bg-gray-900 dark:border-gray-700 shadow-sm transition-colors">
            <CardContent className="p-4 flex flex-col">
              
              {/* Video Preview */}
              <div className="w-full aspect-video mb-4">
                {purchased ? (
                  <ReactPlayer
                    width="100%"
                    height={"100%"}
                    url={course.lectures[0].videoUrl}
                    controls={true}
                  />
                ) : (
                  <div className="w-full h-full relative flex items-center justify-center rounded-xl overflow-hidden 
                    bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 dark:from-gray-800 dark:via-gray-900 dark:to-black">
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-white/70 dark:bg-black/60 backdrop-blur-sm"></div>

                    {/* Content */}
                    <div className="relative z-10 text-center space-y-3 p-6">
                      <div className="flex justify-center">
                        <Lock size={40} className="text-yellow-600 dark:text-yellow-400 animate-bounce" />
                      </div>
                      <h2 className="text-xl font-bold tracking-wide text-gray-900 dark:text-white">
                        This video is not free
                      </h2>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Purchase the course to unlock all lectures
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <h1 className="text-gray-900 dark:text-gray-200 font-semibold">Lecture Title</h1>
              <Separator className="my-2 bg-gray-300 dark:bg-gray-700" />
              <h1 className="text-lg md:text-xl font-semibold text-indigo-700 dark:text-indigo-400">
                Course Price
              </h1>
            </CardContent>

            <CardFooter className="flex justify-center p-4">
              {purchased ? (
                <Button 
                  onClick={handleContinueCourse} 
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white dark:bg-indigo-500 dark:hover:bg-indigo-400"
                >
                  Continue Course
                </Button>
              ) : (
                <BuyCourseButton courseId={courseId} />
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;
