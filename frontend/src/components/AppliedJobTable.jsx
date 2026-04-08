import React, { useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setAllAppliedJobs } from '@/redux/jobSlice'
import { APPLICATION_API_END_POINT } from '@/utils/constant'
import axios from 'axios'

const AppliedJobTable = () => {
    const dispatch = useDispatch();
    const {allAppliedJobs} = useSelector(store=>store.job);
    return (
        <div>
            <Table>
                <TableCaption>A list of your applied jobs</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Job Role</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        allAppliedJobs.length <= 0 ? <span>You haven't applied any job yet.</span> : allAppliedJobs.map((appliedJob) => (
                            <TableRow key={appliedJob._id}>
                                <TableCell>{appliedJob?.createdAt?.split("T")[0]}</TableCell>
                                <TableCell>{appliedJob.job?.title}</TableCell>
                                <TableCell>{appliedJob.job?.company?.name}</TableCell>
                                <TableCell className="text-right"><Badge className={`${appliedJob?.status === "rejected" ? 'bg-red-400' : appliedJob.status === 'pending' ? 'bg-gray-400' : 'bg-green-400'}`}>{appliedJob.status.toUpperCase()}</Badge></TableCell>
                                <TableCell className="text-right">
                                    {appliedJob.status === 'pending' && (
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                                                    title="Withdraw application"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Withdraw Application</DialogTitle>
                                                    <DialogDescription>
                                                        Are you sure you want to withdraw your application for <strong>{appliedJob.job?.title}</strong>? This action cannot be undone.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button type="button" variant="outline">Cancel</Button>
                                                    </DialogClose>
                                                    <Button 
                                                        variant="destructive" 
                                                        onClick={async () => {
                                                            try {
                                                                await axios.delete(`${APPLICATION_API_END_POINT}/delete/${appliedJob._id}`, { withCredentials: true });
                                                                toast.success('Application withdrawn successfully.');
                                                                
                                                                // Refetch applied jobs
                                                                const res = await axios.get(`${APPLICATION_API_END_POINT}/get`, { withCredentials: true });
                                                                if (res.data.success) {
                                                                    dispatch(setAllAppliedJobs(res.data.application));
                                                                }
                                                            } catch (error) {
                                                                toast.error('Failed to withdraw application.');
                                                                console.error(error);
                                                            }
                                                        }}
                                                    >
                                                        Withdraw
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default AppliedJobTable