import axios from "axios";
const getYouTubeResources = async (query) => {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const maxResults = 5;

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=${maxResults}&q=${encodeURIComponent(query)}&key=${apiKey}`;

  const { data } = await axios.get(url);

  return data.items.map((item) => ({
    title: item.snippet.title,
    videoId: item.id.videoId,
    channelTitle: item.snippet.channelTitle,
    thumbnail: item.snippet.thumbnails.default.url,
    link: `https://www.youtube.com/watch?v=${item.id.videoId}`,
  }));
};

export default getYouTubeResources;
