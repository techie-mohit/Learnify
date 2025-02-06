import RichTextEditor from '@/components/RichTextEditor';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import React, { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEditCourseMutation, useGetCourseyIdQuery, usePublishCourseMutation } from '@/features/api/courseApi';
import { toast } from 'sonner';

const CourseTab = () => {

    const [input, setInput] = useState({
        courseTitle: "",
        subTitle: "",
        description: "",
        category: "",
        courseLevel: "",
        coursePrice: "",
        courseThumbnail: ""
    });
    const params = useParams();


    const courseId = params.courseId;


    const { data: courseByIdData, isLoading: courseByIdLoading ,refetch} = useGetCourseyIdQuery(courseId);

    const [publishCourse, {data:publishData, isLoading:publishLoading}] = usePublishCourseMutation();



    useEffect(() => {
        if (courseByIdData?.course) {
            const course = courseByIdData?.course;
            setInput({
                courseTitle: course.courseTitle,
                subTitle: course.subTitle,
                description: course.description,
                category: course.category,
                courseLevel: course.courseLevel,
                coursePrice: course.coursePrice,
                courseThumbnail: "",

            })
        }

    }, [courseByIdData])

    const [previewThumbnail, setPreviewThumbnail] = useState("");
    const navigate = useNavigate();

    const [editCourse, { data, isLoading, isSuccess, error }] = useEditCourseMutation(courseId, {refetchOnMountOrArgChange:true});



    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value })
    }

    const selectCategory = (value) => {
        setInput({ ...input, category: value });
    }
    const selectCourseLevel = (value) => {
        setInput({ ...input, courseLevel: value });

    }
    //get file

    const selectThumbnail = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setInput({ ...input, courseThumbnail: file })

            // giving preview means shoew the demo of your thumbnail
            const fileReader = new FileReader();
            fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
            fileReader.readAsDataURL(file);
        }
    }

    const updateCourseHandler = async () => {
        const formData = new FormData();
        formData.append("courseTitle", input.courseTitle);
        formData.append("subTitle", input.subTitle);
        formData.append("description", input.description);
        formData.append("category", input.category);
        formData.append("courseLevel", input.courseLevel);
        formData.append("coursePrice", input.coursePrice);
        formData.append("courseThumbnail", input.courseThumbnail);

        await editCourse({ formData, courseId });
    };

    const publishStatusHandler= async(action)=>{
        try {
            const response = await publishCourse({courseId, query:action});
            if(response.data){
                refetch()
                toast.success(response.data.message);
            }
            
        } catch (error) {
            toast.error("Failed to published or unplished Course");
            
        }
    }

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message || "Course update.")
            navigate("/admin/course");

        }
        if (error) {
            toast.error(error.data.message || "Failed to update course")
        }
    }, [isSuccess, error])

    if(courseByIdLoading){
        return <Loader2 className="h-4 w-4 animate-spin"/>
    }



    return (
        <Card>
            <CardHeader className="flex flex-row justify-between">
                <div>
                    <CardTitle>Basic Course Information</CardTitle>
                    <CardDescription>
                        Make changes to your Courses here. Click save when you are done.
                    </CardDescription>
                </div>
                <div className='space-x-4'>
                    <Button disabled={courseByIdData?.course.lectures.length=== 0} variant="outline" onClick={()=>publishStatusHandler(courseByIdData?.course.isPublished ? "false" : "true")}>
                        {
                            courseByIdData?.course.isPublished ? "UnPublished" : "Publish"
                        }
                    </Button>
                    <Button>Remove Courses</Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className='space-y-4 mt-5'>
                    <div>
                        <Label>Course Title</Label>
                        <Input
                            type="text"
                            name="courseTitle"
                            value={input.courseTitle}
                            onChange={changeEventHandler}
                            placeholder=" Ex. Full Stack Developer"
                        />
                    </div>
                    <div>
                        <Label>Subtitle</Label>
                        <Input
                            type="text"
                            name="subTitle"
                            value={input.subTitle}
                            onChange={changeEventHandler}
                            placeholder=" Ex.  Become a Full Stack Developer From zero to Hero"
                        />
                    </div>
                    <div>
                        <Label>Description</Label>
                        <RichTextEditor input={input} setInput={setInput} />
                    </div>

                    <div className='flex items-center gap-5'>
                        <div>
                            <Label>Category</Label>
                            <Select onValueChange={selectCategory}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Category</SelectLabel>
                                        <SelectItem value="Next Js">Next Js</SelectItem>
                                        <SelectItem value="MERN">MERN</SelectItem>
                                        <SelectItem value="React Js">React Js</SelectItem>
                                        <SelectItem value="Full Stack Development">Full Stack Development</SelectItem>
                                        <SelectItem value="Backend Development">Backend Development</SelectItem>
                                        <SelectItem value="Mongodb">Mongodb</SelectItem>
                                        <SelectItem value="Devops">Devops</SelectItem>
                                        <SelectItem value="Frontend Development">Frontend Development</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Course Level</Label>
                            <Select onValueChange={selectCourseLevel}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a Course Level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Course Level</SelectLabel>
                                        <SelectItem value="Beginner">Beginner</SelectItem>
                                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                                        <SelectItem value="Advanced">Advanced</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                        </div>
                        <div>
                            <Label>Price in (INR)</Label>
                            <Input
                                type="Number"
                                name="coursePrice"
                                value={input.coursePrice}
                                onChange={changeEventHandler}
                                Placeholder="199"
                                className="w-fit"
                            />
                        </div>

                    </div>
                    <div>
                        <Label> Course Thumbnail</Label>
                        <Input
                            type="file"
                            accept="image/*"
                            className="w-fit"
                            onChange={selectThumbnail}
                        />
                        {
                            previewThumbnail && (
                                <img src={previewThumbnail} className='w-60 h-50 my-2' alt="course thumbnail" />
                            )
                        }
                    </div>
                    <div className='flex gap-4'>
                        <Button variant="outline" onClick={() => navigate("/admin/course")}>Cancel</Button>
                        <Button disabled={isLoading} onClick={updateCourseHandler}>
                            {
                                isLoading ? (
                                    <>
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                        Please Wait</>
                                )
                                    : "Save"
                            }
                        </Button>
                    </div>


                </div>
            </CardContent>

        </Card>
    )
}

export default CourseTab
