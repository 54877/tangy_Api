export interface UserProfileType {
  id: string;
  email: string;
  password: string;
  userName: string;
  createdAt: Date;
  gender: string;
  introduction: string;
  birthday: Date;
  role: string;
}

export interface CourseType {
  title: string;
  teacher: string;
  content: string;
  price: string;
  originalPrice: string;
  image: Express.Multer.File | undefined;
  fileName: string;
  videoKey: string;
  duration: string;
}
