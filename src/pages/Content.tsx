import { useContext } from "react";
import ContentItem from "../components/ContentItem";
import contentcontext from "../contexts/ContentContext";
type contenttype = {
  _id: string;
  userid: string;
  link: string;
  title: string;
  type: string;
  tags: string[];
};

// type ContentResponse = {
//   message: string;
//   contents: contenttype[];
// };

const Content = () => {
  const { contents } = useContext(contentcontext);
  return (
    <div className="grid grid-cols-3 gap-4">
      {contents?.map((content: contenttype) => (
        <ContentItem
          type={content.type}
          link={content.link}
          title={content.title}
          tags={content.tags}
          key={content._id}
          id={content._id}
        />
      ))}
    </div>
  );
};

export default Content;
