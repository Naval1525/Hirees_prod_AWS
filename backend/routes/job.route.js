import express from "express";
import {
  postJob,
  getAllJobs,
  getAdminJobs,
  getJobById,
  updateJob,
  getCompanyJobs,
  getLatestJobs,


} from "../controllers/job.controller.js";

import isAuth from "../middleware/isauth.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();
// Create router




router.post("/postJob", isAuth,singleUpload, postJob);
router.get("/get",  getAllJobs);
router.get("/getlatest",  getLatestJobs);
router.get("/getadminjobs", isAuth, getAdminJobs);
router.get("/get/:id", getJobById);
router.put('/:jobId', updateJob);
router.get('/getCompanyJobs/:id', getCompanyJobs);



export default router;

