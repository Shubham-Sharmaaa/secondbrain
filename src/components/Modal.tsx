import {
  cloneElement,
  createContext,
  useContext,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";

import { createPortal } from "react-dom";

type ModalContextType = {
  openName: string;
  open: (name: string) => void;
  close: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);
type Modaltype = {
  children: ReactNode;
};
const Modal = ({ children }: Modaltype) => {
  const [openName, setName] = useState("");
  const close = () => {
    setName("");
  };
  const open = setName;
  return (
    <ModalContext.Provider value={{ openName, open, close }}>
      {children}
    </ModalContext.Provider>
  );
};
type NameType = {
  name: string;
  children: ReactElement<{ onClick?: () => void }>;
};
function Name({ name, children }: NameType) {
  const context = useContext(ModalContext);
  if (!context) throw new Error("Modal.name be within Modal");
  const { open } = context;
  return cloneElement(children, {
    onClick: () => {
      open(name);
    },
  });
}
type WindowProp = {
  children: ReactElement<{ oncloseModal: () => void }>;
  name: string;
};
function Window({ children, name }: WindowProp) {
  const context = useContext(ModalContext);
  if (!context) throw new Error("Modal.Window be within Modal");
  const { close, openName: contextname } = context;
  if (name !== contextname) return null;
  return createPortal(
    <div className="fixed top-0 left-0 w-full h-screen backdrop-blur-2xl z-1000 transition-all ">
      <div className="bg-amber-200 fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-lg py-[3.2rem] px-16 transition-all ">
        <button className="absolute top-0 left-0 p-2" onClick={close}>
          close
        </button>
        <div>{cloneElement(children, { oncloseModal: close })}</div>
      </div>
    </div>,
    document.body,
  );
}

Modal.Name = Name;
Modal.Window = Window;
export default Modal;
