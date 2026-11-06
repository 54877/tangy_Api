import express from "express";
import { profileCourseRouter } from "./profile/profile_course_router";
import { profilePersonalRouter } from "./profile/profile_personal_router";

export const profile_router = express.Router();

profile_router.use(profilePersonalRouter);
profile_router.use(profileCourseRouter);
