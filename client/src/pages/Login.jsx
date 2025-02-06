import {useEffect, useState} from "react";
import { Button } from "@/components/ui/button"
import {Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {Tabs,TabsContent,TabsList,TabsTrigger} from "@/components/ui/tabs"
import { useRegisterUserMutation , useLoginUserMutation } from "@/features/api/authApi";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Login = ()=> {
    const navigate = useNavigate();
    const [signupInput, setSignupInput] = useState({name:"", email:"", password:""});
    const [loginInput , setLoginInput] = useState({email:"", password:""});
    const [registerUser, {data:registerData, error:registerError, isLoading:registerIsLoading, isSuccess:registerIsSuccess}] = useRegisterUserMutation();
    const [loginUser, {data:loginData, error:loginError, isLoading:loginIsLoading, isSuccess:loginIsSuccess}] = useLoginUserMutation();

    // change handler
    const changeHandlerInput = (e , type)=>{
        const {name, value} = e.target;

        if(type === "signup"){
            setSignupInput({...signupInput, [name]: value});
        }
        else{
            setLoginInput({...loginInput, [name]: value});
        }
    }

    // submit handler
    const handlerRegistration = async(type)=>{
         const inputData = type ==="signup" ? signupInput : loginInput;
         const action = type === "signup" ? registerUser : loginUser;
         await action(inputData);   
    };

    useEffect(()=>{
        if(registerIsSuccess && registerData){
            toast.success(registerData.message || "SignUp Successfull");
            setSignupInput({name:"", email:"", password:""});
        }

        if(registerError){
            toast.error(registerError.data.message || "SignUp Failed");
        }

        if(loginIsSuccess && loginData){
            toast.success(loginData.message || "Login Successfull");
            setLoginInput({email:"", password:""});
            navigate("/");
        }

        if(loginError){
            toast.error(loginError.data.message || "Login Failed");
        }

    },[registerData, registerError, registerIsLoading, loginData, loginError, loginIsLoading]);
  return (
    <div className="flex items-center justify-center w-full py-20">
        <Tabs defaultValue="login" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signup">SignUp</TabsTrigger>
                <TabsTrigger value="login" >Login</TabsTrigger>
            </TabsList>
            <TabsContent value="signup">
                <Card className="border-gray-600">
                    <CardHeader>
                        <CardTitle>SignUp</CardTitle>
                        <CardDescription>
                        Create a new account and click signup when you are done .
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="space-y-1">
                        <Label htmlFor="name">Name</Label>
                        <Input 
                        type="text" 
                        name= "name"
                        value = {signupInput.name}
                        onChange = {(e)=> changeHandlerInput(e, "signup")} 
                        placeholder="eg. abc" 
                        required
                        />
                        </div>
                        <div className="space-y-1">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                        
                        type= "email"  
                        name= "email"
                        value ={signupInput.email}
                        onChange = {(e)=> changeHandlerInput(e, "signup")} 
                        placeholder="eg. abc@gmail.com" 
                        required 
                        />
                        </div>

                        <div className="space-y-1">
                        <Label htmlFor="password">Password</Label>
                        <Input 
                        type= "password"
                        name= "password"
                        value = {signupInput.password}  
                        onChange = {(e)=> changeHandlerInput(e, "signup")}
                        placeholder="eg. xyz" 
                        required 
                        />
                        </div>
                        
                    </CardContent>
                    <CardFooter>
                    <Button  disabled={registerIsLoading} onClick = {()=> handlerRegistration("signup")}>
                        {
                            registerIsLoading ? (
                                <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>Please Wait</>
                            ) : "SignUp"
                        }
                    </Button>
                    </CardFooter>
                </Card>
            </TabsContent>
            <TabsContent value="login">
                <Card className="border-gray-600">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>
                    Login your password here . After signup, you will be logged in .
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                    type= "email" 
                    name= "email"
                    value ={loginInput.email}  
                    onChange = {(e)=> changeHandlerInput(e, "login")} 
                    placeholder="eg. abc@gmail.com" 
                    required

                    />
                    </div>
                    <div className="space-y-1">
                    <Label htmlFor="current"> password</Label>
                    <Input 
                    type="password" 
                    name= "password"
                    value = {loginInput.password}
                    onChange = {(e)=> changeHandlerInput(e, "login")} 
                    placeholder="eg. xyz" 
                    required
                    />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button  disabled={loginIsLoading} onClick = {()=> handlerRegistration("login")}>
                        {
                            loginIsLoading ? (
                                <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>Please Wait</>
                            ) : "Login"
                        }
                    </Button>
                </CardFooter>
                </Card>
            </TabsContent>
        </Tabs>

    </div>
    
  )
}


export default Login;