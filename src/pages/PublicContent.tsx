import { useEffect, useState } from "react";
import ContentItem from "../components/ContentItem";
import Error from "../components/Error";

type contenttype = {
  _id: string;
  userid: string;
  link: string;
  title: string;
  type: string;
  tags: string[];
};

const PublicContent = () => {
  const [contents, setcontents] = useState<contenttype[] | null>(null);
  const [error, seterror] = useState<string | null>(null);
  useEffect(() => {
    async function fetchcontent(userid: string) {
      const res = await fetch(
        `http://localhost:3000/api/v1/content/share/${userid}`,
      );
      const data = await res.json();
      if (data.content) setcontents(data?.content);
      else seterror(data.message || "invalid access");
    }
    const userid = window.location.pathname.split("/")[1];
    fetchcontent(userid);
  }, []);
  console.log(error);
  if (error) {
    return <Error message={error} />;
  }
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

export default PublicContent;
