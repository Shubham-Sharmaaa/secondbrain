import { Share } from "@boxicons/react";
import Button from "../components/Button";
import CreateContentForm from "../components/CreateContentForm";
import Modal from "../components/Modal";
import CreateShareForm from "../components/CreateShareForm";

const Header = ({ ispublic }: { ispublic?: boolean }) => {
  return (
    <>
      {!ispublic && (
        <div className="mx-4 my-6 flex justify-between justify-items-center items-center">
          <h1 className="text-gray-700 font-extrabold text-4xl">All Notes</h1>
          <div className="flex gap-3 ">
            <Modal>
              <Modal.Name name="share">
                <Button type="share flex shrink-0 ">
                  <Share /> Share Brain
                </Button>
              </Modal.Name>
              <Modal.Window name="share">
                <CreateShareForm />
              </Modal.Window>
            </Modal>
            <Modal>
              <Modal.Name name="add">
                <Button type="add">+ Add Content</Button>
              </Modal.Name>
              <Modal.Window name="add">
                <CreateContentForm />
              </Modal.Window>
            </Modal>
          </div>
        </div>
      )}
      {ispublic && (
        <div className="mx-4 my-6 flex justify-between justify-items-center items-center">
          <h1 className="text-gray-700 font-extrabold text-4xl">All Notes</h1>
          <div className="flex gap-3 ">
            {" "}
            <Button type="signin">Signin</Button>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
