import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/redux/authSlice'
import { Loader2 } from 'lucide-react'

const Signup = () => {

    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
        file: ""
    });
    const {loading,user} = useSelector(store=>store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }
    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    }
    const validate = () => {
        if (!input.fullname || !input.email || !input.phoneNumber || !input.password || !input.role || !input.file) {
            toast.error("All fields are compulsory, including profile photo.");
            return false;
        }
       const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(input.email)) {
            toast.error("Please enter a valid email address.");
            return false;
        }
        if (input.phoneNumber.length !== 10) {
            toast.error("Phone number must be exactly 10 digits.");
            return false;
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(input.password)) {
            toast.error("Password must be at least 8 characters, include uppercase, lowercase, a number, and a special character (e.g., Rahul@123).");
            return false;
        }
        return true;
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const formData = new FormData();    
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);
        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': "multipart/form-data" },
                withCredentials: true,
            });
            if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally{
            dispatch(setLoading(false));
        }
    }

    useEffect(()=>{
        if(user){
            navigate("/");
        }
    },[])
    return (
        <div>
            <Navbar />
            <div className='min-h-screen bg-[radial-gradient(ellipse_at_center,theme(colors.slate.950/0.2)_0%,transparent_50%)] flex items-center justify-center w-full max-w-7xl mx-auto p-8'>
                <form onSubmit={submitHandler} className='w-full max-w-md bg-gradient-to-b from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 my-10 shadow-2xl shadow-[0_0_80px_rgba(59,130,246,0.15)]'>
                    <h1 className='font-bold text-3xl mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-lg text-center'>Sign Up</h1>
                    <div className='my-2'>
                        <Label>Full Name</Label>
                        <Input
                            type="text"
                            value={input.fullname}
                            name="fullname"
                            onChange={changeEventHandler}
                            placeholder="Rahul"
                        />
                    </div>
                    <div className='my-2'>
                        <Label className="text-slate-300">Email Address</Label>
                        <Input
                            type="email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            placeholder="rahul@gmail.com"
                            className="bg-slate-800/50 border-slate-700/50 focus:border-[#6A38C2] h-10 text-slate-100"
                        />
                    </div>
                    <div className='my-2'>
                        <Label>Phone Number</Label>
                        <Input
                            type="text"
                            value={input.phoneNumber}
                            name="phoneNumber"
                            onChange={changeEventHandler}
                            placeholder="8669716302"
                        />
                    </div>
                    <div className='my-2'>
                        <Label className="text-slate-300">Password</Label>
                        <Input
                            type="password"
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler}
                            placeholder="Rahul@123"
                            className="bg-slate-800/50 border-slate-700/50 focus:border-[#6A38C2] h-10 text-slate-100"
                        />
                    </div>
                    <div className='flex flex-col gap-4 mt-4 mb-6'>
                        <RadioGroup className="flex items-center gap-6">
                            <div className="flex items-center space-x-2 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="role"
                                    value="student"
                                    checked={input.role === 'student'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer w-4 h-4 accent-[#6A38C2]"
                                    id="student-signup"
                                />
                                <Label htmlFor="student-signup" className="cursor-pointer group-hover:text-white transition-colors">Student</Label>
                            </div>
                            <div className="flex items-center space-x-2 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="role"
                                    value="recruiter"
                                    checked={input.role === 'recruiter'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer w-4 h-4 accent-[#6A38C2]"
                                    id="recruiter-signup"
                                />
                                <Label htmlFor="recruiter-signup" className="cursor-pointer group-hover:text-white transition-colors">Recruiter</Label>
                            </div>
                        </RadioGroup>
                        <div className='flex items-center gap-2'>
                            <Label className="text-slate-300 font-medium">Profile</Label>
                            <Input
                                accept="image/*"
                                type="file"
                                onChange={changeFileHandler}
                                className="cursor-pointer bg-slate-800/50 border-slate-700/50 text-slate-400 h-10 file:bg-blue-600 file:text-white file:border-0 file:rounded-l-md file:px-3 hover:file:bg-blue-700 transition-all duration-200"
                            />
                        </div>
                    </div>
                    <Button disabled={loading} type="submit" className="w-full my-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:brightness-110 hover:shadow-xl shadow-lg transition-all">
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Please wait
                          </>
                        ) : (
                          "Sign Up"
                        )}
                      </Button>
                    <div className='text-center text-sm text-slate-400'>
                        Already have an account? <Link to="/login" className='text-blue-500 hover:text-blue-400 font-medium'>Login</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Signup

