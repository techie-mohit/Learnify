import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateLectureMutation, useGetCourseLectureQuery } from '@/features/api/courseApi'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import Lecture from './Lecture'

const CreateLecture = () => {
    const navigate = useNavigate();
    const [lectureTitle, setLectureTitle] = useState("");
    const params = useParams();
    const courseId = params.courseId;

    const [createLecture, {data, isSuccess, isLoading, error}] = useCreateLectureMutation();

    const {data:lectureData, isLoading:lectureLoading, isError:lectureError,refetch} = useGetCourseLectureQuery(courseId);
    

    const createLectureHandler = async()=>{
        await createLecture({lectureTitle, courseId});
    };



    useEffect(()=>{
        if(isSuccess){
            refetch();
            toast.success(data?.message);
            setLectureTitle("")
        }
        if(error){
            toast.error(error.data.message);
        }

    },[isSuccess, error])

    console.log(lectureData);

  return (
    <div className='flex-1 mx-10 '>
            <div className='mb-4'>
                <h1 className='font-bold text-xl'> Lets add Lecture, add some basic lecture details for new Lectue</h1>
                <p className='text-sm'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis, harum.</p>

            </div>
            <div className='space-y-4'>
                <div>
                    <Label>Title</Label>
                    <Input 
                    type="text"
                    value={lectureTitle}
                    onChange={((e)=> setLectureTitle(e.target.value))} 
                    placeholder="Your Title Name" />
                </div>
                <div className='flex gap-3'>
                    <Button variant="outline" onClick={()=> navigate(`/admin/course/${courseId}`)}>Back To Course</Button>
                    <Button disbaled={isLoading} onClick={createLectureHandler} >
                        {isLoading ? (
                            <>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                            please wait
                            </>
                            
                        ): "Create Lecture"
                        }
                    </Button>
                </div>

                <div className='mt-10'>
                    {
                        lectureLoading ? (
                        <p>Lecture Loading ....</p>
                    )   :lectureError ? (
                        <p>Failed to load Lecture</p>
                    )   :lectureData.lectures.length === 0 ? (
                        <p>No Lecture Available</p> 
                    )   :(
                        lectureData.lectures.map((lecture, index)=>(
                          <Lecture key={lecture._id} lecture={lecture} index={index} courseId={courseId}/>  
                        ))
                        
                    )}

                </div>

            </div>


        </div>
  )
}

export default CreateLecture

