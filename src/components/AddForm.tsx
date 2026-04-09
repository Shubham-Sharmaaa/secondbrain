import Modal from "./Modal";

const AddForm = () => {
  return (
    <div>
      <Modal>
        {/* Trigger */}
        <Modal.Name name="testModal">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Open Modal
          </button>
        </Modal.Name>

        {/* Modal Window */}
        <Modal.Window name="testModal">
          <div className="text-black">
            <h2 className="text-xl font-bold">Hello Modal 👋</h2>
            <p>This is your modal content</p>
          </div>
        </Modal.Window>
      </Modal>
    </div>
  );
};

export default AddForm;
