import {
  createCourseLogic,
  createCourseVideoLogic,
  getMyCourseDetailByIdLogic,
  getCourseFormOptionsLogic,
  getMyCourseLogic,
  reReviewMyCourseLogic,
} from "../../services/profile/profile_course_service";
import { JwtAsyncFunction } from "../../types/asyncType";
import { success } from "../../utils/success";

export const createCourseVideo: JwtAsyncFunction = async (req, res) => {
  const { duration, videoKey, videoTicket } = await createCourseVideoLogic(
    req.file,
    req.user.id,
  );

  success(res, 200, { videoKey, duration, videoTicket });
};

export const createCourse: JwtAsyncFunction = async (req, res) => {
  const {
    title,
    teacher,
    content,
    price,
    originalPrice,
    videoKey,
    duration,
    videoTicket,
    categoryKey,
  } = req.body;
  const parsedTagsKey: unknown = JSON.parse(req.body.tagsKey);
  const tagsKey = (
    Array.isArray(parsedTagsKey) ? parsedTagsKey : [parsedTagsKey]
  ).map(String);

  await createCourseLogic({
    userId: req.user.id,
    title,
    teacher,
    content,
    price,
    originalPrice,
    image: req.file,
    videoKey,
    duration,
    videoTicket,
    tagsKey,
    categoryKey,
  });

  success(res, 200);
};

export const getCourseFormOptions: JwtAsyncFunction = async (_req, res) => {
  success(res, 200, await getCourseFormOptionsLogic());
};

export const getMyCourse: JwtAsyncFunction = async (req, res) => {
  success(res, 200, await getMyCourseLogic(req.user.id));
};

export const getMyCourseDetailById: JwtAsyncFunction = async (req, res) => {
  success(res, 200, await getMyCourseDetailByIdLogic(req.body.id, req.user.id));
};

export const reReviewMyCourse: JwtAsyncFunction = async (req, res) => {
  const {
    id,
    title,
    teacher,
    content,
    price,
    originalPrice,
    videoKey,
    duration,
    videoTicket,
    categoryKey,
  } = req.body;

  const parsedTags: unknown = JSON.parse(req.body.tagsKey);
  const tagsKey = (Array.isArray(parsedTags) ? parsedTags : [parsedTags]).map(
    String,
  );
  const image = req.file;

  await reReviewMyCourseLogic({
    id,
    userId: req.user.id,
    title,
    teacher,
    content,
    price,
    originalPrice,
    categoryKey,
    tagsKey,
    image,
    videoKey,
    duration,
    videoTicket,
  });
  success(res, 200);
};
