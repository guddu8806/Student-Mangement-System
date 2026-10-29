const enrollmentService = require("../services/enrollment.service");

// create and drop

const createEnroll = async(req , res, next) =>{
    try{
        const {student_id , course_id} = req.body;
        const enroll = await enrollmentService.createEnrollment({student_id , course_id});
        res.status(201).json({
            success:true,
            message:"Enrolled successfully",
        });
    }catch(error){
        next(error);
    }
};


