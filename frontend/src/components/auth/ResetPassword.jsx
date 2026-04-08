import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setLoading } from '@/redux/authSlice'
import { Loader2 } from 'lucide-react'

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { loading } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token } = useParams();

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/reset-password/${token}`, { password }, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/login");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            dispatch(setLoading(false));
        }
    }

    return (
        <div>
            <Navbar />
            <div className='min-h-screen bg-[radial-gradient(ellipse_at_center,theme(colors.slate.950/0.2)_0%,transparent_50%)] flex items-center justify-center w-full max-w-7xl mx-auto p-8'>
                <form onSubmit={submitHandler} className='w-full max-w-md bg-gradient-to-b from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 my-10 shadow-2xl shadow-[0_0_80px_rgba(59,130,246,0.15)]'>
                    <h1 className='font-bold text-3xl mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-lg text-center'>Reset Password</h1>
                    <div className='my-4'>
                        <Label className="text-slate-300">New Password</Label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Entet new password"
                            className="bg-slate-800/50 border-slate-700/50 focus:border-[#6A38C2] h-11 text-slate-100"
                        />
                    </div>
                    <div className='my-4'>
                        <Label className="text-slate-300">Confirm Password</Label>
                        <Input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            className="bg-slate-800/50 border-slate-700/50 focus:border-[#6A38C2] h-11 text-slate-100"
                        />
                    </div>
                    {
                        loading ? (
                            <Button className="w-full my-6 bg-gradient-to-r from-blue-500 to-purple-600">
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
                            </Button>
                        ) : (
                            <Button type="submit" className="w-full my-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:brightness-110 shadow-lg transition-all">
                                Update Password
                            </Button>
                        )
                    }
                </form>
            </div>
        </div>
    )
}

export default ResetPassword
