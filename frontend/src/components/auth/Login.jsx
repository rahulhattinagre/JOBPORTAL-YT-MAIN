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
import { setLoading, setUser } from '@/redux/authSlice'
import { Loader2 } from 'lucide-react'

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "",
    });
    const { loading, user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            dispatch(setLoading(false));
        }
    }
    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [])
    return (
        <div>
            <Navbar />
            <div className='min-h-screen bg-[radial-gradient(ellipse_at_center,theme(colors.slate.950/0.2)_0%,transparent_50%)] flex items-center justify-center w-full max-w-7xl mx-auto p-8'>
                <form onSubmit={submitHandler} className='w-full max-w-md bg-gradient-to-b from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 my-10 shadow-2xl shadow-[0_0_80px_rgba(59,130,246,0.15)]'>
                    <h1 className='font-bold text-3xl mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-lg text-center'>Login</h1>
                    <div className='my-4'>
                        <Label className="text-slate-300">Email Address</Label>
                        <Input
                            type="email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            placeholder="rahul@gmail.com"
                            className="bg-slate-800/50 border-slate-700/50 focus:border-[#6A38C2] h-11 text-slate-100"
                        />
                    </div>

                    <div className='my-4'>
                        <div className='flex items-center justify-between'>
                            <Label className="text-slate-300">Password</Label>
                            <Link to="/forgot-password"><span className='text-xs text-blue-500 hover:underline cursor-pointer'>Forgot Password?</span></Link>
                        </div>
                        <Input
                            type="password"
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler}
                            placeholder="Rahul@123"
                            className="bg-slate-800/50 border-slate-700/50 focus:border-[#6A38C2] h-11 text-slate-100 mt-1"
                        />
                    </div>
                    <div className='flex items-center justify-between mt-4 mb-6'>
                        <RadioGroup className="flex items-center gap-6">
                            <div className="flex items-center space-x-2 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="role"
                                    value="student"
                                    checked={input.role === 'student'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer w-4 h-4 accent-[#6A38C2]"
                                    id="student-login"
                                />
                                <Label htmlFor="student-login" className="cursor-pointer group-hover:text-white transition-colors">Student</Label>
                            </div>
                            <div className="flex items-center space-x-2 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="role"
                                    value="recruiter"
                                    checked={input.role === 'recruiter'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer w-4 h-4 accent-[#6A38C2]"
                                    id="recruiter-login"
                                />
                                <Label htmlFor="recruiter-login" className="cursor-pointer group-hover:text-white transition-colors">Recruiter</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    {
                        loading ? (
                            <Button className="w-full my-6 bg-gradient-to-r from-blue-500 to-purple-600">
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
                            </Button>
                        ) : (
                            <Button type="submit" className="w-full my-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:brightness-110 hover:shadow-xl shadow-lg transition-all">
                                Login
                            </Button>
                        )
                    }
                    <div className='text-center text-sm text-slate-400'>
                        Don't have an account? <Link to="/signup" className='text-blue-500 hover:text-blue-400 font-medium'>Signup</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login