const express = require('express');
const User = require('../models/user.model');

const { body, validationResult } = require('express-validator');
const router = express.Router();


router.post('/',
body('first_name').notEmpty().withMessage("Name is required"),
body('last_name').notEmpty().withMessage("last_name is required"),
body('email').isEmail().withMessage("email is required"),
body('pincode').isLength({ min: 6,max: 6 }).withMessage("pincode is required"),
body('age').custom((value)=>{
    const isNumber = /^[0-9]*$/.test(value);
    if(!isNumber || value < 0 || value >99){
        throw new Error("Invalid age entry, please enter non negative age between 0-99")
    }
    return true;
}),
body('gender').isString().withMessage("Gender is required, in string format"),
async (req,res)=>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const newErrors = errors.array().map(({msg,param,location}) => {
            return {
                [param]: msg,
            };
        });
      return res.status(400).json({ errors: newErrors });
    }
    try{
        const user = await User.create(req.body);
        return res.status(201).json({user});
}catch(e){
    return res.status(500).json({message:e.message});
}
})

router.get('/',async (req, res) => {
    try{
        const user = await User.find().lean().exec();
        return res.status(201).json({user});
    }catch(e){
        return res.status(500).json({message:e.message});
    }
})
// router.post('/', async (req, res)=>{
//     try{
//         const user = await User.create(req.body);
//         sendMail(
//             "masai@school.com",
//              req.body.email,
//             `Welcome to ABC system ${req.body.first_name} ${req.body.last_name}`,
//             `Hi ${req.body.first_name}, Please confirm your email address`,
//             `<h1>Hi ${req.body.first_name}, Please confirm your email address</h1>`
//         );

//         const to_string = ["a@a.com","b@b.com","c@c.com","ravi@r.com","ram@r.com"];

//         to_string.forEach((ele)=>{
//             adminMail(
//                 req.body.email,
//                  ele,
//                 ` ${user.first_name} ${user.last_name} has registered with u`,
//                 `Please welcome ${user.first_name} ${user.last_name}`,
//                 `<h1>Please welcome ${user.first_name} ${user.last_name}</h1>`
//             );
//         })

//         return res.status(201).json({user});
//     }catch(e){
//         return res.status(500).json({status:"failed",message: e.message});
//     }
// })

// router.get("/", async (req, res) => {
//     try{
//         const page = +req.query.page || 1;
//         const size = +req.query.size || 2;
//         const skip = (page - 1) * size;
//         const totalPages = Math.ceil(await User.find().countDocuments()/size);
//         const users = await User.find().skip(skip).limit(size).lean().exec();
//         return res.json({users,totalPages});
//     }catch(e){
//         return res.status(500).json({status:"failed",message: e.message});
//     }    
// });

module.exports= router;