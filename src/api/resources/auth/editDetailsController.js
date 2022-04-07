import {
    db
} from "../../../models";


var editDetails = async function (req, res, next) {
    if (req.user.id) {
        try {
            await db.Users.update({
                city:req.body.data.city,
                state:req.body.data.state,
                pincode:req.body.data.pin
            },{
                where:{
                    id:req.user.id
                }
            })
            return res.status(200).json({
                success:true,
                message:"Successfully Updated Profile",
            })
        } catch (error) {
            console.log(error);
            return res.status(403).json({
                success:false,
                message:"Something Went Wrong",
            })
        }
    } else {
        return res.status(404).json({
            success:false,
            message:"Invalid User",
        })
    }
}

exports.editDetails = editDetails;
