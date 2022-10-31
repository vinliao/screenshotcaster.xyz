import { TwitterApi } from 'twitter-api-v2';

export const twitterClient = new TwitterApi({
  appKey: process.env.FARCASTER_BOT_API_KEY,
  appSecret: process.env.FARCASTER_BOT_API_KEY_SECRET,
  accessToken: process.env.FARCASTER_BOT_ACCESS_TOKEN,
  accessSecret: process.env.FARCASTER_BOT_ACCESS_TOKEN_SECRET
});