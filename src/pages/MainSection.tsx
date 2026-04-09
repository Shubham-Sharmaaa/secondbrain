import Header from "./Header";
import Content from "./Content";
import PublicContent from "./PublicContent";

const MainSection = ({ ispublic }: { ispublic?: boolean }) => {
  return (
    <>
      {!ispublic && (
        <div className="bg-gray-200 flex-1">
          <Header />
          <Content />
        </div>
      )}
      {ispublic && (
        <div className="bg-gray-200 flex-1">
          <Header ispublic={true} />
          <PublicContent />
        </div>
      )}
    </>
  );
};

export default MainSection;
