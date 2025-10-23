// // components/LessonPreviewWrapper.js
// import React from "react";
// import { useLocation } from "react-router-dom";
// import LessonPreview from "./LessonPreview";

// const LessonPreviewWrapper = () => {
//   const location = useLocation();
//   const { type, title, fileUrl, testId } = location.state || {};

//   if (!type || !fileUrl) {
//     return <p className="text-danger text-center mt-5">Invalid preview data</p>;
//   }

//   return (
//     <div className="container py-4">
//       <h4 className="mb-4 text-center">{title}</h4>
//       <LessonPreview type={type} fileUrl={fileUrl} testId={testId} />
//     </div>
//   );
// };

// export default LessonPreviewWrapper;




import React from "react";
import { useLocation } from "react-router-dom";
import LessonPreview from "./LessonPreview";

const LessonPreviewWrapper = () => {
  const location = useLocation();
  const { type, title, fileUrl, testId, mockTestId } = location.state || {};

  if (!type || (!fileUrl && !mockTestId)) {
    return <p className="text-danger text-center mt-5">Invalid preview data</p>;
  }

  return (
    <div className="container py-4">
      <h4 className="mb-4 text-center">{title}</h4>
      <LessonPreview
        type={type}
        fileUrl={fileUrl}
        testId={testId}
        mockTestId={mockTestId}
      />
    </div>
  );
};

export default LessonPreviewWrapper;
