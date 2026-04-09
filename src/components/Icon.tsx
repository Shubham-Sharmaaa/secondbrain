import { CiLink, CiShare2 } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { FiYoutube } from "react-icons/fi";
import { TiDocument } from "react-icons/ti";
import { Twitter } from "@boxicons/react";
import { useContext } from "react";
import contentcontext from "../contexts/ContentContext";
interface IconProp {
  type?: string;
  link?: string;
  id?: string;
}
const Icon = ({ type, link, id }: IconProp) => {
  const { deleteContent } = useContext(contentcontext);
  console.log(deleteContent);
  return (
    <div>
      {type &&
        (type === "share" ? (
          <CiShare2 />
        ) : type === "delete" ? (
          <button onClick={() => id && deleteContent(id)}>
            <MdDelete />
          </button>
        ) : null)}

      {link &&
        (link === "youtube" ? (
          <FiYoutube />
        ) : link === "document" ? (
          <TiDocument />
        ) : link === "tweet" ? (
          <Twitter />
        ) : link === "link" ? (
          <CiLink />
        ) : null)}
    </div>
  );
};

export default Icon;
{
  /* <div>
  {type === "share" ? <CiShare2 /> : type === "delete" ? <MdDelete /> : ""}
  {link === "youtube" ? (
    <FiYoutube />
  ) : link === "document" ? (
    <TiDocument />
  ) : link === "tweet" ? (
    <Twitter />
  ) : link === "link" ? (
    <CiLink />
  ) : (
    ""
  )}
</div>; */
}
