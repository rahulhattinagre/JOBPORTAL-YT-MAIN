import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';

// const randomJobs = [1, 2,45];

const Browse = () => {
    useGetAllJobs();
    const { allJobs = [], searchedQuery = "", filters = { Location: [], Industry: [], Salary: [] } } = useSelector(store => store.job);
    const dispatch = useDispatch();
    const [filterJobs, setFilterJobs] = useState(allJobs);

    useEffect(() => {
        let filtered = [...allJobs];

        // 1. Text search
        if (searchedQuery) {
            filtered = filtered.filter((job) => {
                const query = searchedQuery.toLowerCase().trim();
                const title = job.title.toLowerCase();
                const description = job.description.toLowerCase();
                
                if (title.includes(query) || description.includes(query)) {
                    return true;
                }
                
                const words = query.split(/\s+/);
                if (words.length > 1) {
                    return words.every(word => 
                        word.length > 2 && (title.includes(word) || description.includes(word))
                    );
                }
                return false;
            });
        }

        // 2. Multi-criteria filters
        const hasLocationFilter = filters?.Location?.length > 0;
        const hasIndustryFilter = filters?.Industry?.length > 0;
        const hasSalaryFilter = filters?.Salary?.length > 0;

        if (hasLocationFilter || hasIndustryFilter || hasSalaryFilter) {
            filtered = filtered.filter(job => {
                let matchesLocation = true;
                let matchesIndustry = true;
                let matchesSalary = true;

                if (hasLocationFilter) {
                    matchesLocation = filters.Location.some(loc => job.location.toLowerCase().includes(loc.toLowerCase()));
                }
                if (hasIndustryFilter) {
                    matchesIndustry = filters.Industry.some(ind => job.title.toLowerCase().includes(ind.toLowerCase()) || job.description.toLowerCase().includes(ind.toLowerCase()));
                }
                if (hasSalaryFilter) {
                    matchesSalary = filters.Salary.some(sal => job.salary.toString().toLowerCase().includes(sal.split('-')[0].toLowerCase()) || sal.toLowerCase().includes(job.salary.toString().toLowerCase()));
                }
                return matchesLocation && matchesIndustry && matchesSalary;
            });
        }

        setFilterJobs(filtered);
    }, [allJobs, searchedQuery, filters]);
    useEffect(()=>{
        return ()=>{
            dispatch(setSearchedQuery(""));
        }
    },[])
    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto my-10'>
                <h1 className='font-bold text-xl my-10'>Search Results ({filterJobs.length})</h1>
                <div className='grid grid-cols-3 gap-4'>
                    {
                        filterJobs.map((job) => {
                            return (
                                <Job key={job._id} job={job}/>
                            )
                        })
                    }
                </div>

            </div>
        </div>
    )
}

export default Browse