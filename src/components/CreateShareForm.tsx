import { useEffect, useState } from "react";
// type share = {
//   oncloseModal?: () => void;
// };
const CreateShareForm = () => {
  const [link, setlink] = useState<string>("");
  useEffect(() => {
    async function getlink() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/api/v1/brain/share", {
          method: "PUT",
          headers: {
            "Content-Type": "Application/json",
            Authorization: "bearer " + token,
          },
          body: JSON.stringify({ share: true }),
        });
        const data = await res.json();
        console.log(data);
        setlink(data.link);
      } catch (err) {
        console.log(err);
      }
    }
    getlink();
  }, []);

  return (
    <div>
      <div>
        <label>link:</label>
        <h2>{link}</h2>
      </div>
    </div>
  );
};

export default CreateShareForm;
