interface TagProp {
  tag: string;
}

const TagItem = ({ tag }: TagProp) => {
  return (
    <span className="px-3 py-1 text-xs font-medium rounded-full bg-zinc-800 text-zinc-200 border border-zinc-700 hover:bg-white hover:text-black transition-all duration-200 cursor-pointer">
      #{tag}
    </span>
  );
};

export default TagItem;
