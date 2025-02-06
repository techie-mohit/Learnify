import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreateCourseMutation } from '@/features/api/courseApi'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

function AddCourse() {
    const [courseTitle, setCourseTitle] = useState("");
    const [category, setCategory] = useState("");
    const [createCourse, {data,isLoading, error, isSuccess}]= useCreateCourseMutation();
    const navigate = useNavigate();

    const getSelectedCategory = async(value)=>{
        setCategory(value)
    }

    const createCourseHandler = async()=>{
        await createCourse({courseTitle, category});
   }

   useEffect(()=>{
    if(isSuccess){
        toast.success(data?.message || "course Created")
        navigate("/admin/course");
    }

   },[isSuccess, error])
    
    return (
        <div className='flex-1 mx-10 '>
            <div className='mb-4'>
                <h1 className='font-bold text-xl'> Lets add Course, add some basic course details for new course</h1>
                <p className='text-sm'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis, harum.</p>

            </div>
            <div className='space-y-4'>
                <div>
                    <Label>Title</Label>
                    <Input 
                    type="text"
                    value={courseTitle}
                    onChange={((e)=> setCourseTitle(e.target.value))} 
                    placeholder="Your Course Name" />
                </div>

                <div>
                    <Label>Category</Label>
                    <Select onValueChange={getSelectedCategory}>
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
                <div className='flex gap-3'>
                    <Button variant="outline" onClick={()=> navigate("/admin/course")}>Back</Button>
                    <Button disbaled="isLoading" onClick={createCourseHandler}>
                        {isLoading ? (
                            <>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                            please wait
                            </>
                            
                        ): "Create"
                        }
                    </Button>
                </div>

            </div>


        </div>
    )
}

export default AddCourse
