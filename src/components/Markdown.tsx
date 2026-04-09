import ReactMarkdown from "react-markdown";

const Markdown = ({ content }: { content: string }) => {
  return <ReactMarkdown>{content}</ReactMarkdown>;
};

export default Markdown;
