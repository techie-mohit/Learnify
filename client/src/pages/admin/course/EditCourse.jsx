import { Button } from '@/components/ui/button'
import React from 'react'
import { Link } from 'react-router-dom'
import CourseTab from './CourseTab'

const EditCourse = () => {
    return (
        <div className='flex-1 '>
            <div className='flex items-center justify-between mb-5'>
                <h1 className='font-bold text-xl'>Add Details Information Regarding Course </h1>
                <Link to="lecture">
                    <Button variant="ghost" className="bg-slate-300 hover:bg-slate-600">Go To Lecture Page</Button>
                </Link>
            </div>
            <CourseTab/>

        </div>
    )
}

export default EditCourse
