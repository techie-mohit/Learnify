import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {userLoggedIn, userLoggedOut} from '../authSlice.js';

const USER_API = "http://localhost:8080/api/user/";


export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: USER_API,
        credentials: 'include'
    }),
    endpoints: (builder)=>({
        registerUser : builder.mutation({           // jab api se data fetch karna hai to query use karenge and jab data post karna hai to mutation use karenge
            query: (inputData)=>({
                url : "register",
                method:'POST',
                body: inputData
            })
        }),
        loginUser : builder.mutation({           // jab api se data fetch karna hai to query use karenge and jab data post karna hai to mutation use karenge
            query: (inputData)=>({
                url : "login",
                method:'POST',
                body: inputData
            }),
            async onQueryStarted(arg, {dispatch, queryFulfilled}){
                try {
                    const result = await queryFulfilled;
                    dispatch(userLoggedIn({user:result.data.user}));
                    
                } catch (error) {
                    console.log(error);
                    
                }
            }
        }),

        logoutUser: builder.mutation({
            query: ()=>({
                url:"logout",
                method: 'GET'
            }),
            async onQueryStarted(arg, {dispatch, queryFulfilled}){
                try {
                    dispatch(userLoggedOut());
                    
                } catch (error) {
                    console.log(error);
                    
                }
            }
        }),

        loadUser:builder.query({
            query: ()=>({
                url: "profile",
                method: 'GET'
            }),
            async onQueryStarted(arg, {dispatch, queryFulfilled}){
                try {
                    const result = await queryFulfilled;
                    dispatch(userLoggedIn({user:result.data.user}));
                    
                } catch (error) {
                    console.log(error);
                    
                }
            }
        }),

        updateUser:builder.mutation({
            query: (formData)=>({
                url: "profile/update",
                method: 'PUT',
                body: formData,
                credentials: 'include'
            })
        })



    })
});

export const {useRegisterUserMutation, useLoginUserMutation, useLogoutUserMutation, useLoadUserQuery, useUpdateUserMutation} = authApi;    // useRegistrationUserMutation and useLoginUserMutation are hooks which we can use in our components to make api calls
