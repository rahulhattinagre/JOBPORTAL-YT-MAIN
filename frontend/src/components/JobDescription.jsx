import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

const JobDescription = () => {
    const {singleJob} = useSelector(store => store.job);
    const {user} = useSelector(store=>store.auth);
    const isIntiallyApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false;
    const [isApplied, setIsApplied] = useState(isIntiallyApplied);

    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();

    const applyJobHandler = async () => {
        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {withCredentials:true});
            
            if(res.data.success){
                setIsApplied(true); // Update the local state
                const updatedSingleJob = {...singleJob, applications:[...singleJob.applications,{applicant:user?._id}]}
                dispatch(setSingleJob(updatedSingleJob)); // helps us to real time UI update
                toast.success(res.data.message);

            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    useEffect(()=>{
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`,{withCredentials:true});
                if(res.data.success){
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(res.data.job.applications.some(application=>application.applicant === user?._id)) // Ensure the state is in sync with fetched data
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSingleJob(); 
    },[jobId,dispatch, user?._id]);

    return (
        <div className='max-w-7xl mx-auto my-14 px-6 md:px-8 bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 p-8 rounded-3xl shadow-2xl transition-all duration-500'>
            {singleJob ? (
                <>
                    <div className='flex flex-col md:flex-row items-center justify-between gap-6'>
                        <div>
                            <h1 className='font-extrabold text-4xl text-white'>{singleJob?.title}</h1>
                            <div className='flex flex-wrap items-center gap-3 mt-6'>
                                <Badge className='bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold px-4 py-1.5 rounded-full' variant="outline">{singleJob?.postion || singleJob?.position} Positions</Badge>
                                <Badge className='bg-red-500/10 text-red-400 border border-red-500/20 font-semibold px-4 py-1.5 rounded-full' variant="outline">{singleJob?.jobType}</Badge>
                                <Badge className='bg-purple-500/10 text-purple-400 border border-purple-500/20 font-semibold px-4 py-1.5 rounded-full' variant="outline">{singleJob?.salary} LPA</Badge>
                                <Badge className='bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold px-4 py-1.5 rounded-full' variant="outline">{singleJob?.location}</Badge>
                            </div>
                        </div>
                        <Button
                            onClick={isApplied ? null : applyJobHandler}
                            disabled={isApplied}
                            className={`rounded-full px-10 py-7 text-lg font-bold transition-all duration-300 shadow-[0_0_20px_rgba(114,9,183,0.3)] hover:shadow-[0_0_30px_rgba(114,9,183,0.5)] ${isApplied ? 'bg-slate-700 text-slate-400 cursor-not-allowed border border-slate-600' : 'bg-[#6A38C2] hover:bg-[#5b30a6] text-white hover:scale-105 active:scale-95'}`}
                        >
                            {isApplied ? 'Already Applied' : 'Apply Now'}
                        </Button>
                    </div>

                    <div className='mt-12 group'>
                        <h2 className='text-2xl font-bold border-b border-slate-800/80 pb-4 mb-8 text-white relative flex items-center gap-3'>
                             <span className='w-1.5 h-8 bg-[#6A38C2] rounded-full inline-block'></span>
                             Job Description
                        </h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12'>
                            <div className='flex items-start gap-4'>
                                <span className='font-bold text-slate-400 min-w-[120px]'>Role:</span>
                                <span className='text-slate-100 font-medium'>{singleJob?.title || "N/A"}</span>
                            </div>
                            <div className='flex items-start gap-4'>
                                <span className='font-bold text-slate-400 min-w-[120px]'>Location:</span>
                                <span className='text-slate-100 font-medium'>{singleJob?.location || "N/A"}</span>
                            </div>
                            <div className='flex items-start gap-4 col-span-1 md:col-span-2'>
                                <span className='font-bold text-slate-400 min-w-[120px]'>Description:</span>
                                <span className='text-slate-100 leading-relaxed max-w-4xl'>{singleJob?.description || "N/A"}</span>
                            </div>
                            <div className='flex items-start gap-4'>
                                <span className='font-bold text-slate-400 min-w-[120px]'>Experience:</span>
                                <span className='text-slate-100 font-medium'>{singleJob?.experience || "0"} yrs</span>
                            </div>
                            <div className='flex items-start gap-4'>
                                <span className='font-bold text-slate-400 min-w-[120px]'>Salary:</span>
                                <span className='text-slate-100 font-medium font-mono'>{singleJob?.salary || "0"} LPA</span>
                            </div>
                            <div className='flex items-start gap-4'>
                                <span className='font-bold text-slate-400 min-w-[120px]'>Total Applicants:</span>
                                <span className='bg-slate-800 text-slate-100 px-3 py-1 rounded-md font-bold'>{singleJob?.applications?.length || 0}</span>
                            </div>
                            <div className='flex items-start gap-4'>
                                <span className='font-bold text-slate-400 min-w-[120px]'>Posted Date:</span>
                                <span className='text-slate-100 font-medium font-mono'>{singleJob?.createdAt?.split("T")[0] || "N/A"}</span>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className='flex items-center justify-center min-h-[300px]'>
                    <div className='text-center space-y-4'>
                        <div className='w-12 h-12 border-4 border-slate-700 border-t-[#6A38C2] rounded-full animate-spin mx-auto'></div>
                        <p className='text-slate-400 font-medium'>Loading Job Details...</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default JobDescription