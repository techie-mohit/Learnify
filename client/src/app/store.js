import {configureStore} from '@reduxjs/toolkit';
import rootReducer from './rootReducer.js';
import { authApi } from '@/features/api/authApi.js';
import { courseApi } from '@/features/api/courseApi';
import { purchaseApi } from '@/features/api/purchaseApi.js';
import { courseProgressApi } from '@/features/api/courseProgressApi.js';


export const  appStore = configureStore({
    reducer:rootReducer,
    middleware :(defaultMiddleware)=>defaultMiddleware().concat(authApi.middleware, courseApi.middleware, purchaseApi.middleware, courseProgressApi.middleware)
});

// jab bhi user refresh karega to uska data store me save rahega aur isAuthenticaed me true rahega
const initializedApp = async()=>{
    await appStore.dispatch(authApi.endpoints.loadUser.initiate({},{forceRefetch:true}));
}

initializedApp();
