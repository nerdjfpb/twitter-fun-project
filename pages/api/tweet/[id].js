import axios from "axios";

const token = process.env.authToken;

const handler = async (req, res) => {
  console.log(req.method);
  const {
    query: { id },
  } = req;

  try {
    const response = await axios.get(
      `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${id}&count=20`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response || !response.data || response.data?.length === 0) {
      return res.status(400).json({ total: 0, tweetIds: [] });
    }

    const sortedArray = response.data.sort(
      (a, b) => b.favorite_count - a.favorite_count
    );

    const singleTweet = sortedArray.map((item) => {
      return { id: item?.id_str, favCount: item?.favorite_count };
    });

    res.status(200).json({ total: singleTweet?.length, tweetIds: singleTweet });
  } catch (error) {
    console.error(error);

    res.status(400).json({ total: 0, data: [] });
  }
};

export default handler;
