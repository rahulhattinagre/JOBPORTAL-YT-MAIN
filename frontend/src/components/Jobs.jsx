import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

// const jobsArray = [1, 2, 3, 4, 5, 6, 7, 8];

const Jobs = () => {
    const { allJobs = [], searchedQuery = "", filters = { Location: [], Industry: [], Salary: [] } } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);

    useEffect(() => {
        let filtered = [...allJobs];

        // 1. Filter by Text Search
        if (searchedQuery) {
            filtered = filtered.filter((job) => {
                const query = searchedQuery.toLowerCase().trim();
                const title = job.title.toLowerCase();
                const description = job.description.toLowerCase();
                const location = job.location.toLowerCase();
                
                if (title.includes(query) || description.includes(query) || location.includes(query)) {
                    return true;
                }
                
                const words = query.split(/\s+/);
                if (words.length > 1) {
                    return words.every(word => 
                        word.length > 2 && (title.includes(word) || description.includes(word) || location.includes(word))
                    );
                }
                return false;
            });
        }

        // 2. Filter by Multiple Criteria (Location, Industry, Salary)
        const hasLocationFilter = filters?.Location?.length > 0;
        const hasIndustryFilter = filters?.Industry?.length > 0;
        const hasSalaryFilter = filters?.Salary?.length > 0;

        if (hasLocationFilter || hasIndustryFilter || hasSalaryFilter) {
            filtered = filtered.filter(job => {
                let matchesLocation = true;
                let matchesIndustry = true;
                let matchesSalary = true;

                if (hasLocationFilter) {
                    matchesLocation = filters.Location.some(loc => 
                        job.location.toLowerCase().includes(loc.toLowerCase())
                    );
                }

                if (hasIndustryFilter) {
                    matchesIndustry = filters.Industry.some(ind => 
                        job.title.toLowerCase().includes(ind.toLowerCase()) || 
                        job.description.toLowerCase().includes(ind.toLowerCase())
                    );
                }

                if (hasSalaryFilter) {
                    // Assuming salary in job is a string like "40k" or number LPA
                    // We'll do a simple string match against the selected salary range strings for now
                    // as the exact logic depends on the job data format
                    matchesSalary = filters.Salary.some(sal => 
                        job.salary.toString().toLowerCase().includes(sal.split('-')[0].toLowerCase()) ||
                        sal.toLowerCase().includes(job.salary.toString().toLowerCase())
                    );
                }

                return matchesLocation && matchesIndustry && matchesSalary;
            });
        }

        setFilterJobs(filtered);
    }, [allJobs, searchedQuery, filters]);

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto mt-5'>
                <div className='flex gap-6 lg:gap-8'>
                    <div className='w-[22%]'>
                        <FilterCard />
                    </div>
                    {
                        filterJobs.length <= 0 ? <span>Job not found</span> : (
                            <div className='flex-1 h-[88vh] overflow-y-auto pb-5'>
                                <div className='grid grid-cols-3 gap-4'>
                                    {
                                        filterJobs.map((job) => (
                                            <motion.div
                                                initial={{ opacity: 0, x: 100 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -100 }}
                                                transition={{ duration: 0.3 }}
                                                key={job?._id}>
                                                <Job job={job} />
                                            </motion.div>
                                        ))
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Jobs