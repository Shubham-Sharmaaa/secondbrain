import Sidebar from "./Sidebar";
import MainSection from "./MainSection";
import { useEffect, useState } from "react";
import contentcontext from "../contexts/ContentContext";
type ContentResponse = {
  message: string;
  contents: contenttype[];
};
type contenttype = {
  _id: string;
  userid: string;
  link: string;
  title: string;
  type: string;
  tags: string[];
};
const Home = () => {
  const [data, setData] = useState<ContentResponse | null>(null);
  async function fetchcontent() {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:3000/api/v1/content", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const res = await response.json();
      console.log(res);
      setData(res);
      console.log(data);
    } catch (err) {
      console.log("error ", err);
    }
  }
  useEffect(() => {
    async function call() {
      await fetchcontent();
    }
    call();
  }, []);
  async function deleteContent(contentId: string) {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:3000/api/v1/content", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ contentId }),
    });
    const data = await res.json();
    if (data) await fetchcontent();
    console.log(data);
  }
  return (
    <contentcontext.Provider
      value={{ contents: data?.contents, deleteContent }}
    >
      <div className="flex">
        <Sidebar />
        <MainSection />
      </div>
    </contentcontext.Provider>
  );
};
export default Home;
