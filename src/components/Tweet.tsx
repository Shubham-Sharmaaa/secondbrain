interface TweetProp {
  link: string;
}
import { useEffect } from "react";

const Tweet = ({ link }: TweetProp) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <blockquote className="twitter-tweet flex items-center justify-center">
      <a href={link}>click</a>
    </blockquote>
  );
};

export default Tweet;
