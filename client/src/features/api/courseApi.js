import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_API = "https://learnify-uy89.onrender.com/api/course";

export const courseApi = createApi({
  reducerPath: "courseApi",
  tagTypes: ["Refetch_Creator_Course","Refetch_Lecture"],
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_API,
    credentials: "include",
  }),

  endpoints: (builder) => ({
    createCourse: builder.mutation({
      // jab api se data fetch karna hai to query use karenge and jab data post karna hai to mutation use karenge
      query: ({ courseTitle, category }) => ({
        url: "",
        method: "POST",
        body: { courseTitle, category },
      }),
      invalidatesTags: ["Refetch_Creator_Course"],
    }),

    getSearchCourse : builder.query({
      query:({searchQuery, categories, sortByPrice})=>{
        // Bui;d query string
        let queryString = `/search?query=${encodeURIComponent(searchQuery)}`;

        // append Categories
        if(categories && categories.length > 0){
          const categoriesString = categories.map(encodeURIComponent).join(",");
          queryString += `&categories=${categoriesString}` ;
        }

        // append sort By Price
        if(sortByPrice){
          queryString += `&sortByPrice=${encodeURIComponent(sortByPrice)}` ;
        }

        return {
          url:queryString,
          method:"GET"
        }
      }
    }),

    getPublishedCourse:builder.query({
      query:()=>({
        url:"/published-courses",
        method:"GET"
      })
    }),
    getCreatorCourses: builder.query({
      query: () => ({
        url: "",
        method: "GET",
      }),
      providesTags: ["Refetch_Creator_Course"],
    }),
    editCourse: builder.mutation({
      query: ({ formData, courseId }) => ({
        url: `/${courseId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Refetch_Creator_Course"],
    }),
    getCourseById: builder.query({
      query: (courseId) => ({
        url: `/${courseId}`,
        method: "GET",
      }),
      providesTags: ["Refetch_Creator_Course"],
    }),

    createLecture: builder.mutation({
      query: ({ lectureTitle, courseId }) => ({
        url: `/${courseId}/lecture`,
        method: "POST",
        body: { lectureTitle },
      }),
      invalidatesTags: ["Refetch_Creator_Course"],
    }),
    getCourseLecture: builder.query({
      query: (courseId) => ({
        url: `/${courseId}/lecture`,
        method: "GET",
      }),
      providesTags: ["Refetch_Creator_Course","Refetch_Lecture"],
    }),
    editLecture:builder.mutation({
        query:({lectureTitle, videoInfo, isPreviewFree, courseId, lectureId})=>({
            url:`/${courseId}/lecture/${lectureId}`,
            method:"POST",
            body:{lectureTitle, videoInfo, isPreviewFree}
        }),
        invalidatesTags: ["Refetch_Creator_Course"],
    }),
    removeLecture:builder.mutation({
      query:(lectureId)=>({
          url:`/lecture/${lectureId}`,
          method:"DELETE",
          
      }),
      invalidatesTags: ["Refetch_Creator_Course","Refetch_Lecture"],
    }),
    getLectureById : builder.query({
      query:(lectureId)=>({
        url:`/lecture/${lectureId}`,
        method:"GET"
      })

    }),

    publishCourse :builder.mutation({
      query:({courseId, query})=>({
        url:`/${courseId}?publish=${query}`,
        method:"PATCH"

      }),
      invalidatesTags: ["Refetch_Creator_Course"],
    })
  }),
});

export const {
  useCreateCourseMutation,
  useGetSearchCourseQuery,
  useGetPublishedCourseQuery,
  useGetCreatorCoursesQuery,
  useEditCourseMutation,
  useGetCourseByIdQuery,
  useCreateLectureMutation,
  useGetCourseLectureQuery,
  useEditLectureMutation,
  useRemoveLectureMutation,
  useGetLectureByIdQuery,
  usePublishCourseMutation,

} = courseApi;
