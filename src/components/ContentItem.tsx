import Icon from "./Icon";
import Markdown from "./Markdown";
import TagItem from "./TagItem";
import Tweet from "./Tweet";
import Video from "./Video";
interface ContentItemProp {
  type: string;
  link: string;
  title: string;
  tags: string[];
  id: string;
}
const ContentItem = ({ type, link, title, tags, id }: ContentItemProp) => {
  return (
    <div className="p-4 border rounded-xl shadow-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Icon link={type} />
          <h2 className="font-semibold">{title}</h2>
        </div>
        <div className="flex gap-2">
          <Icon type="share" />
          <Icon type="delete" id={id} />
        </div>
      </div>
      <div className="mt-3">
        {type === "youtube" && <Video link={link} />}
        {type === "tweet" && <Tweet link={link} />}
        {(type === "document" || type === "link") && (
          <Markdown content={link} />
        )}
      </div>

      <div className="flex gap-2 mt-3 flex-wrap">
        {tags.map((tag, index) => (
          <TagItem key={index} tag={tag} />
        ))}
      </div>
      <div className="text-sm text-gray-400 mt-2">Added on</div>
    </div>
  );
};

export default ContentItem;
