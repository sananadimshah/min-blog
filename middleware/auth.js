import jwt, { decode } from 'jsonwebtoken';
import blogmodel from "../models/blogModel.js";
import authorModel from "../models/authorModel.js";


const auth = async(req,res,next) =>{
    try {
        let token = req.headers['x-auth-token']
        if(!token) return res.status(400).send({status : false , msg : "token is required"})
        let decoded = jwt.verify(token ,"blogging" ,(err , token) => {
         if(err) return undefined
         return token
         
    })
    console.log(token)
    if(decoded === undefined) return res.status(401).send({status : false , msg : "pls provides valid token in header"})
    req.decoded = decoded

return next()
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}
const authorization = async (req, res, next) => {
    try {
        const loginUserId = req.decoded.authorId;
        const ID = req.params.blogId;

        console.log("Blog ID:", ID); // Log the ID to check if it's valid

        let bloguser = await blogmodel.findById(ID).maxTimeMS(20000);
        console.log("Blog User:", bloguser); // Log the blog user to check if it's null

        if (!bloguser) {
            return res.status(404).send({ status: false, msg: "Blog not found" });
        }

        if (bloguser.authorId.toString() !== loginUserId) {
            return res.status(403).send({ status: false, msg: "Not Authorized" });
        }

        return next();
    } catch (err) {
        console.error(err);
        return res.status(500).send({ status: false, msg: "Internal Server Error" });
    }
};


// const authorization = async (req, res, next) => {
//     try {
//         const loginUserId = req.decoded.authorId;
//         const ID = req.params.blogId
         
//         let bloguser = await blogmodel.findById(ID);
//       console.log(bloguser)
//         if (!bloguser) {
//             return res.status(404).send({ status: false, msg: "Blog not found" });
//         }

//         if (bloguser.authorId.toString() !== loginUserId) {
//             return res.status(403).send({ status: false, msg: "Not Authorized" });
//         }

//         // If authorized, proceed to the next middleware
//         return next();
//     } catch (err) {
//         // Log the error and return an error response
//         console.error(err);
//         return res.status(500).send({ status: false, msg: "Internal Server Error" });
//     }
// };

export {auth, authorization };
