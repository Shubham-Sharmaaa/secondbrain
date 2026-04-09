import Logo from "../components/Logo";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ ispublic }: { ispublic?: boolean }) => {
  const navigate = useNavigate();
  const listyle = "hover:cursor-pointer ";

  return (
    <>
      {!ispublic && (
        <div className="bg-gray-100 h-screen flex flex-col w-64 shrink-0 gap-10 px-2 pt-4 items-center">
          <Logo />
          <ul className="h-[50%] font-medium text-gray-600 flex flex-col gap-3  text-xl ">
            <li className={listyle} onClick={() => navigate("/tweets")}>
              Tweets
            </li>
            <li className={listyle} onClick={() => navigate("/videos")}>
              Videos
            </li>
            <li className={listyle} onClick={() => navigate("/documents")}>
              Documents
            </li>
            <li className={listyle} onClick={() => navigate("/links")}>
              Links
            </li>
            <li className={listyle} onClick={() => navigate("/tags")}>
              Tags
            </li>
          </ul>
        </div>
      )}
      {ispublic && (
        <div className="bg-gray-100 h-screen flex flex-col w-64 shrink-0 gap-10 px-2 pt-4 items-center">
          <Logo />
          <ul className="h-[50%] font-medium text-gray-600 flex flex-col gap-3  text-xl ">
            <li className={listyle} onClick={() => navigate("/tweets")}>
              Tweets
            </li>
            <li className={listyle} onClick={() => navigate("/videos")}>
              Videos
            </li>
            <li className={listyle} onClick={() => navigate("/documents")}>
              Documents
            </li>
            <li className={listyle} onClick={() => navigate("/links")}>
              Links
            </li>
            <li className={listyle} onClick={() => navigate("/tags")}>
              Tags
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default Sidebar;
