import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'

const LatestJobCards = ({job}) => {
    const navigate = useNavigate();
    return (
        <div onClick={()=> navigate(`/description/${job._id}`)} className='group p-6 rounded-2xl shadow-xl bg-slate-900/40 border border-slate-800/80 cursor-pointer hover:border-[#6A38C2]/40 hover:bg-slate-800/50 transition-all duration-500 backdrop-blur-md relative overflow-hidden flex flex-col justify-between h-full'>
            <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#6A38C2]/10 to-transparent rounded-bl-full transform translate-x-10 -translate-y-10 group-hover:translate-x-6 group-hover:-translate-y-6 transition-transform duration-500'></div>
            
            <div className='relative z-10'>
                <div className="flex items-center gap-3 mb-4">
                    <div className='w-10 h-10 bg-[#6A38C2]/20 rounded-lg flex items-center justify-center text-[#6A38C2] font-bold text-xl'>
                        {job?.company?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 className='font-bold text-white group-hover:text-[#6A38C2] transition-colors'>{job?.company?.name}</h1>
                        <p className='text-xs text-slate-400 font-medium uppercase tracking-wider'>{job?.location || 'India'}</p>
                    </div>
                </div>
                
                <h1 className='font-extrabold text-xl mb-2 text-slate-100 line-clamp-1'>{job?.title}</h1>
                <p className='text-sm text-slate-400 line-clamp-3 leading-relaxed mb-6 group-hover:text-slate-300 transition-colors'>{job?.description}</p>
            </div>

            <div className='flex flex-wrap items-center gap-2 relative z-10 pt-2'>
                <Badge className='bg-blue-400/10 text-blue-400 border-none px-3 py-1' variant="secondary">{job?.position || 0} Positions</Badge>
                <Badge className='bg-[#F83002]/10 text-[#F83002] border-none px-3 py-1' variant="secondary">{job?.jobType}</Badge>
                <Badge className='bg-[#6A38C2]/10 text-[#6A38C2] border-none px-3 py-1' variant="secondary">{job?.salary} LPA</Badge>
            </div>
        </div>
    )
}

export default LatestJobCards