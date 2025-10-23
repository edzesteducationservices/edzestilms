export const getCloudinaryUploadUrl = (cloudName, lessonType) => {
  const rawTypes = [
    "PDF", "Slides", "Article", "Assignment", "Section Quiz", "Scorm/Tincan"
  ];
  const uploadType = rawTypes.includes(lessonType) ? "raw" : "upload";
  return `https://api.cloudinary.com/v1_1/${cloudName}/${uploadType}`;
};
