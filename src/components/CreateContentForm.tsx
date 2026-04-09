// import { useContext } from "react";
// import contentcontext from "../contexts/ContentContext";

// type contentformtype = {
//   oncloseModal?: () => void;
// };
// const CreateContentForm = ({ oncloseModal }: contentformtype) => {
//   const { contents } = useContext(contentcontext);
//   const tags = contents?.flatMap((content) => content.tags) || [];
//   function handleSubmit() {
//     oncloseModal?.();
//   }
//   const input = "bg-amber-300";
//   console.log(tags);

//   return (
//     <form onSubmit={handleSubmit}>
//       <input className={input} name="type" placeholder="type" />
//       <input className={input} name="link" placeholder="link" />
//       <input className={input} name="title" placeholder="title" />
//       <select name="tags" value={tags[0]}>
//         {tags.map((tag) => (
//           <option value={tag} key={tag} />
//         ))}
//       </select>
//       <button>add</button>
//     </form>
//   );
// };

// export default CreateContentForm;
import { useContext, useState } from "react";
import contentcontext from "../contexts/ContentContext";

type contentformtype = {
  oncloseModal?: () => void;
};

const CreateContentForm = ({ oncloseModal }: contentformtype) => {
  const { contents } = useContext(contentcontext);

  // 🔹 selected tags
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedValue, setSelectedValue] = useState("");

  // 🔹 extract all tags from contents
  const allTags = contents?.flatMap((content) => content.tags) || [];

  // 🔹 remove duplicates
  const uniqueTags = Array.from(new Set(allTags));

  // 🔹 add tag
  function handleAddTag(tag: string) {
    if (selectedTags.includes(tag)) return;
    setSelectedTags([...selectedTags, tag]);
  }

  // 🔹 remove tag
  function removeTag(tag: string) {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  }

  // 🔹 submit form
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const data = {
      type: formData.get("type"),
      link: formData.get("link"),
      title: formData.get("title"),
      tags: selectedTags, // ✅ important
    };

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3000/api/v1/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token, // ✅ fixed
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      console.log(result);
    } catch (err) {
      console.log(err);
    }

    oncloseModal?.();
  }

  const input = "bg-amber-300 p-2 rounded";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input className={input} name="type" placeholder="type" />
      <input className={input} name="link" placeholder="link" />
      <input className={input} name="title" placeholder="title" />

      {/* 🔽 Dropdown */}
      <select
        value={selectedValue}
        onChange={(e) => {
          const tag = e.target.value;
          if (tag) {
            handleAddTag(tag);
            setSelectedValue(""); // reset dropdown
          }
        }}
        className="p-2 border rounded"
      >
        <option value="">Select tag</option>
        {uniqueTags.map((tag) => (
          <option key={tag} value={tag}>
            {tag}
          </option>
        ))}
      </select>

      {/* 🧩 Selected tags */}
      <div className="flex gap-2 flex-wrap">
        {selectedTags.map((tag) => (
          <div
            key={tag}
            className="bg-purple-500 text-white px-3 py-1 rounded-full flex items-center gap-2"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-sm"
            >
              ❌
            </button>
          </div>
        ))}
      </div>

      <button className="bg-blue-400 p-2 rounded text-white">
        Add Content
      </button>
    </form>
  );
};

export default CreateContentForm;
