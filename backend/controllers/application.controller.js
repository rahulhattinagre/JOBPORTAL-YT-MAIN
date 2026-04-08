import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { sendEmail } from "../utils/email.js";

export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;
        if (!jobId) {
            return res.status(400).json({
                message: "Job id is required.",
                success: false
            })
        };
        // check if the user has already applied for the job
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this jobs",
                success: false
            });
        }

        // check if the jobs exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            })
        }
        // create a new application
        const newApplication = await Application.create({
            job:jobId,
            applicant:userId,
        });

        job.applications.push(newApplication._id);
        await job.save();
        return res.status(201).json({
            message:"Job applied successfully.",
            success:true
        })
    } catch (error) {
        console.log(error);
    }
};
export const getAppliedJobs = async (req,res) => {
    try {
        const userId = req.id;
        const application = await Application.find({applicant:userId}).sort({createdAt:-1}).populate({
            path:'job',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'company',
                options:{sort:{createdAt:-1}},
            }
        });
        if(!application){
            return res.status(404).json({
                message:"No Applications",
                success:false
            })
        };
        return res.status(200).json({
            application,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}
// admin dekhega kitna user ne apply kiya hai
export const getApplicants = async (req,res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:'applications',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'applicant'
            }
        });
        if(!job){
            return res.status(404).json({
                message:'Job not found.',
                success:false
            })
        };
        return res.status(200).json({
            job, 
            succees:true
        });
    } catch (error) {
        console.log(error);
    }
}


export const updateStatus = async (req,res) => {
    try {
        const {status} = req.body;
        const applicationId = req.params.id;
        if(!status){
            return res.status(400).json({
                message:'status is required',
                success:false
            })
        };

        // find the application by applicantion id
        const application = await Application.findOne({_id:applicationId}).populate({
            path: 'applicant',
            select: 'email fullname'
        }).populate({
            path: 'job',
            populate: {
                path: 'company',
                select: 'name'
            }
        });
        
        if(!application){
            return res.status(404).json({
                message:"Application not found.",
                success:false
            })
        };

        // update the status
        application.status = status.toLowerCase();
        await application.save();

        if(status.toLowerCase() === 'accepted'){
            const subject = `Congratulations! Selected for ${application.job.title} at ${application.job.company.name}`;
            const text = `Hi ${application.applicant.fullname},\n\nWe are pleased to inform you that you have been selected for the position of "${application.job.title}" at ${application.job.company.name}.\n\nThe recruiter will contact you soon for further steps.\n\nBest regards,\n${application.job.company.name} Team`;
            
            await sendEmail(application.applicant.email, subject, text);
        } else if (status.toLowerCase() === 'rejected') {
            const subject = `Update on your application for ${application.job.title}`;
            const text = `Hi ${application.applicant.fullname},\n\nThank you for your interest in the "${application.job.title}" position at ${application.job.company.name}. After careful consideration, we regret to inform you that we will not be moving forward with your application at this time.\n\nWe appreciate your time and wish you the best in your job search.\n\nBest regards,\n${application.job.company.name} Team`;
            
            await sendEmail(application.applicant.email, subject, text);
        }

        return res.status(200).json({
            message:"Status updated successfully.",
            success:true
        });

    } catch (error) {
        console.log(error);
    }
}

export const deleteApplication = async (req, res) => {
    try {
        const applicationId = req.params.id;
        const userId = req.id;

        const application = await Application.findOne({_id: applicationId}).populate('job');
        if (!application) {
            return res.status(404).json({
                message: "Application not found.",
                success: false
            });
        }

        if (application.applicant.toString() !== userId) {
            return res.status(403).json({
                message: "Unauthorized to delete this application.",
                success: false
            });
        }

        if (application.status !== 'pending') {
            return res.status(400).json({
                message: "Can only withdraw pending applications.",
                success: false
            });
        }

        // Delete application
        await Application.findByIdAndDelete(applicationId);

        // Remove ref from Job.applications
        await Job.findByIdAndUpdate(application.job._id, {
            $pull: { applications: applicationId }
        });

        return res.status(200).json({
            message: "Application withdrawn successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error.",
            success: false
        });
    }
};

