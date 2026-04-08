import React, { useState } from 'react'
import { Button } from './ui/button'
import { Search } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    return (
        <div className='text-center'>
            <div className='flex flex-col gap-5 my-10'>
                <span className=' mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#F83002] font-medium'>No. 1 CareerConnect Website</span>
                <h1 className='text-5xl font-bold'>Search, Apply & <br /> Get Your <span className='text-[#6A38C2]'>Dream Jobs</span></h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">Find jobs that match your skills and passion. Start your career journey with us today!</p>
                <div className='flex w-full max-w-2xl shadow-2xl border border-slate-700/50 rounded-full mx-auto bg-slate-900/40 backdrop-blur-md focus-within:ring-2 focus-within:ring-[#6A38C2] transition-all duration-300 overflow-hidden h-14'>
                    <input
                        type="text"
                        placeholder='Find your dream jobs'
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && searchJobHandler()}
                        className='outline-none border-none w-full bg-transparent text-slate-100 px-8 py-3 placeholder:text-slate-500 font-medium'
                    />
                    <Button onClick={searchJobHandler} className="rounded-none rounded-r-full bg-[#6A38C2] h-full px-10 hover:bg-[#5b30a6] transition-all duration-300 shadow-none border-l border-slate-700/50">
                        <Search className='h-6 w-6 text-white' />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default HeroSection