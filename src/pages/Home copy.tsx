import Sidebar from "./Sidebar";
import MainSection from "./MainSection";

const PublicHome = () => {
  return (
    <div className="flex">
      <Sidebar ispublic={true} />
      <MainSection ispublic={true} />
    </div>
  );
};
export default PublicHome;
