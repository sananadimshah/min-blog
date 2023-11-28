import express from "express";
const router = express.Router()
import {createauthor,login} from "../controllers/authorController.js";
import {createblogs,getBlogs,updateBlogs,deleteBlogs,deletebyQyery,} from '../controllers/blogController.js'
import {auth,authorization} from '../middleware/auth.js'

//**************************************Author Api***************************/
router.post('/authors',createauthor)

router.post('/login',login)

//**************************************Blogs Api***************************/
router.post('/blogs',auth,createblogs)

router.get('/blogs',auth,getBlogs)

router.put('/blogs/:blogId',auth,authorization,updateBlogs)

router.delete('/blogs/:blogId',auth,authorization,deleteBlogs)

router.delete('/blogs',auth,authorization,deletebyQyery)




export default router