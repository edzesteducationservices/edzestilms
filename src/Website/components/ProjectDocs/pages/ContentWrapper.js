import { useParams } from "react-router-dom";
import Content from "./Content";
import Chapter1 from '../data/Chapter1';
import Chapter2 from '../data/Chapter2';
import Chapter3 from '../data/Chapter3';
import Chapter4 from '../data/Chapter4';
import Chapter5 from '../data/Chapter5';
import Chapter6 from '../data/Chapter6';
import Chapter7 from '../data/Chapter7';
import Chapter8 from '../data/Chapter8';
import Chapter9 from '../data/Chapter9';
import Chapter10 from '../data/Chapter10';



const DocsWrapper = () => {
    const contentDataMap = {
        chapter_1: Chapter1,
        chapter_2: Chapter2,
        chapter_3: Chapter3,
        chapter_4: Chapter4,
        chapter_5: Chapter5,
        chapter_6: Chapter6,
        chapter_7: Chapter7,
        chapter_8: Chapter8,
        chapter_9: Chapter9,
        chapter_10: Chapter10,
      };
  const { chapterId } = useParams();
  const contentData = contentDataMap[chapterId] || []; // Get data or empty object if not found

  return <Content contentData={contentData} />;
};

export default DocsWrapper;
