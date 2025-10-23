// import InThisArticle from "./inThisArticle";

// const MainContent = ({ chapter }) => {
//   if (!chapter) return <div className="col-md-9 ms-sm-auto p-4">Select a chapter.</div>;

//   return (
//     <main className="col-md-9 ms-sm-auto p-4">
//       <h1 className="fw-bold">{chapter.title}</h1>
//       {chapter.content && chapter.content.map((para, index) => (
//         <p key={index} id={`section-${index}`}>{para}</p>
//       ))}

//       {chapter.approaches && (
//         <>
//           <h2 className="mt-4">Project Management Approaches</h2>
//           <ul className="list-group">
//             {chapter.approaches.map((approach, index) => (
//               <li key={index} className="list-group-item">
//                 <strong>{approach.name}:</strong> {approach.description}
//               </li>
//             ))}
//           </ul>
//         </>
//       )}

//       <InThisArticle chapter={chapter} />
//     </main>
//   );
// };

// export default MainContent;
