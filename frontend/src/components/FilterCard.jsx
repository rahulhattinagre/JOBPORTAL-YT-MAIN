import React, { useEffect, useState } from 'react'
import { Label } from './ui/label'
import { Checkbox } from './ui/checkbox'
import { useDispatch, useSelector } from 'react-redux'
import { setFilters } from '@/redux/jobSlice'
import { Button } from './ui/button'
import { X } from 'lucide-react'

const filterData = [
    {
        filterType: "Location",
        array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"]
    },
    {
        filterType: "Industry",
        array: ["Frontend Developer", "Backend Developer", "FullStack Developer", "Data Science", "Graphic Designer"]
    },
    {
        filterType: "Salary",
        array: ["0-40k", "42-1lakh", "1lakh to 5lakh"]
    },
]

const FilterCard = () => {
    const dispatch = useDispatch();
    const { filters = { Location: [], Industry: [], Salary: [] } } = useSelector(store => store.job);
    const [localFilters, setLocalFilters] = useState(filters);

    const changeHandler = (type, value) => {
        setLocalFilters(prev => {
            const currentSelected = prev[type] || [];
            const isSelected = currentSelected.includes(value);
            const updated = isSelected 
                ? currentSelected.filter(item => item !== value)
                : [...currentSelected, value];
            
            return { ...prev, [type]: updated };
        });
    }

    const clearFilters = () => {
        const resetFilters = { Location: [], Industry: [], Salary: [] };
        setLocalFilters(resetFilters);
        dispatch(setFilters(resetFilters));
    }

    useEffect(() => {
        dispatch(setFilters(localFilters));
    }, [localFilters, dispatch]);

    const hasFilters = localFilters && Object.values(localFilters).some(arr => Array.isArray(arr) && arr.length > 0);

    return (
        <div className='w-full bg-slate-900/40 backdrop-blur-md border border-slate-700/50 p-6 rounded-2xl shadow-xl transition-all duration-500'>
            <div className='flex items-center justify-between mb-4'>
                <h1 className='font-bold text-xl text-white'>Filter Jobs</h1>
                {hasFilters && (
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={clearFilters}
                        className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-full flex items-center gap-1 transition-all"
                    >
                        <X size={14} /> Clear
                    </Button>
                )}
            </div>
            <hr className='border-slate-800 mb-6' />
            <div className='space-y-8'>
                {
                    filterData.map((data, index) => (
                        <div key={index} className='space-y-4'>
                            <h1 className='font-bold text-md text-slate-300 uppercase tracking-wider'>{data.filterType}</h1>
                            <div className='space-y-3'>
                                {
                                    data.array.map((item, idx) => {
                                        const itemId = `id${index}-${idx}`
                                        return (
                                            <div key={idx} className='flex items-center space-x-3 group cursor-pointer'>
                                                <Checkbox 
                                                    id={itemId} 
                                                    checked={localFilters[data.filterType]?.includes(item) || false}
                                                    onChange={() => changeHandler(data.filterType, item)}
                                                />
                                                <Label 
                                                    htmlFor={itemId} 
                                                    className="text-slate-400 font-medium group-hover:text-slate-100 cursor-pointer transition-colors"
                                                >
                                                    {item}
                                                </Label>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default FilterCard