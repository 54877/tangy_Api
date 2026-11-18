import { getHomepageCourseDb } from "../repository/homePage_Repository";
import { getStorageUrls } from "../utils/supabase/getStorageUrl";

const shuffle = <T>(items: T[]): T[] => {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }

  return shuffled;
};

export const getHomepageCourseLogic = async () => {
  const dataList = await getHomepageCourseDb();

  const courses = dataList.map(({ courseTags, category, ...course }) => ({
    ...course,
    tags: courseTags.map(({ tag }) => tag.label),
    category: category.CategoryName,
  }));

  const coursesByCategory = courses.reduce((groups, course) => {
    const group = groups.get(course.category);

    if (group) {
      group.push(course);
    } else {
      groups.set(course.category, [course]);
    }

    return groups;
  }, new Map<string, typeof courses>());

  const eligibleCategories = [...coursesByCategory].filter(
    ([, group]) => group.length >= 2,
  );

  const selectedCourses = shuffle(eligibleCategories)
    .slice(0, 3)
    .flatMap(([, categoryCourses]) => shuffle(categoryCourses).slice(0, 2));

  return getStorageUrls(selectedCourses, "course", "image");
};
