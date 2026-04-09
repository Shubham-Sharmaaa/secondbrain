interface VideoProp {
  link: string;
}
const Video = ({ link }: VideoProp) => {
  const getEmbedUrl = (url: string) => {
    const videoid = url.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${videoid}`;
  };
  return (
    <div className="w-full aspect-video">
      <iframe
        className="w-full h-full rounded-lg"
        src={getEmbedUrl(link)}
        title="YouTube video"
        allowFullScreen
      />
    </div>
  );
};

export default Video;
