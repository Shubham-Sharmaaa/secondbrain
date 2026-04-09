import { createContext } from "react";

const contentcontext = createContext<{
  contents: contenttype[] | undefined;
  deleteContent: (contentId: string) => Promise<void> | undefined;
}>({
  contents: undefined,
  deleteContent: async () => {},
});
type contenttype = {
  _id: string;
  userid: string;
  link: string;
  title: string;
  type: string;
  tags: string[];
};
export default contentcontext;
