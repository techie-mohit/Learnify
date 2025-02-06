import { LogOutIcon, Menu, School } from 'lucide-react'
import React, {useEffect} from 'react'
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel,  DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import DarkMode from '@/DarkMode'
import { Sheet ,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet'
import { Separator } from '@radix-ui/react-dropdown-menu'
import { Link, useNavigate } from 'react-router-dom'
import { useLogoutUserMutation } from '@/features/api/authApi'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'


const Navbar = () => {
    const {user} = useSelector((store)=>store.auth);  // store me jo data hai usko use karne ke liye useSelector hook use karenge
    const [logoutUser, {data, isSuccess}] =  useLogoutUserMutation();
    const navigate = useNavigate();

    const logoutHandler = async()=>{
        await logoutUser();
    }

    useEffect(() => {
      if(isSuccess){
        toast.success(data.message || "Logged out successfully");
        navigate("/login");
      }
    }, [isSuccess])
    
  return (
    <div className='h-16 dark:bg-[#020817] bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10'>
        <div className=' max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full'>
            <div className='flex gap-2 items-center'>
                <School size= {"30"}/>
                <Link to="/"><h1 className='hidden md:block font-extrabold text-2xl'>E-Learning</h1 ></Link>
            </div>
            {/* user icon and dark mode icon */}
            <div className='flex items-center gap-8'>
                {
                    user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Avatar>
                                <AvatarImage src={user?.photoUrl || "https://github.com/shadcn.png"} alt="@shadcn" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem><Link to = "myLearning">My Learning</Link></DropdownMenuItem>
                                    <DropdownMenuItem>{" "}<Link to ="editProfile">Edit Profile</Link>{" "}</DropdownMenuItem>
                                    <DropdownMenuItem onClick={logoutHandler}><LogOutIcon /><span>Log out</span></DropdownMenuItem>

                                </DropdownMenuGroup>
                                {
                                    user?.role === "instructor" && (
                                        <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem><Link to ="/admin/dashboard" >Dashboard</Link></DropdownMenuItem>
                                        
                                        </>
                                    )
                                }
                            </DropdownMenuContent>
                        </DropdownMenu>
                        
                    ): (
                        <div className='flex items-center gap-2'>
                            <Button variant="outline" onClick = {()=> navigate("/login")}>Login</Button>
                            <Button   onClick = {()=> navigate("/login")} >SignUp</Button>
                        </div>
                    )

                }
                <DarkMode/>

            </div>
        </div>
        <div className='flex md:hidden items-center justify-between px-4 h-full '>
            <h1 className='font-extrabold text-2xl '>E-Learning</h1>
            <MobileNavbar user={user}/>
        </div>
    </div>
  )
}

export default Navbar


const MobileNavbar = ({user})=>{
    const navigate = useNavigate();
    return(
        <Sheet>
            <SheetTrigger asChild>
                <Button size='icon' className="rounded-full hover:bg-gray-200" variant="outline">
                    <Menu/>
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col">
                <SheetHeader className="flex flex-row items-center justify-between mt-2">
                    <SheetTitle><Link  to="/">E-Learning</Link></SheetTitle>
                    <DarkMode/>
                </SheetHeader>
                <Separator/>
                <nav className='flex flex-col space-y-4'>
                    <Link to="/my-learning">My Learning</Link>
                    <Link to="/profile">Edit Profile</Link>
                    <Link to="/logout">Log out</Link>

                </nav>
                {
                    user?.role === "instructor" && (
                        <SheetFooter>
                            <SheetClose asChild>
                                <Button type="submit" onClick={()=> navigate("/admin/dashboard")}>DashBoard</Button>
                            </SheetClose>
                        </SheetFooter>

                    )
                }
                
            </SheetContent>
        </Sheet>


    )
}
