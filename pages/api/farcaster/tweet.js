import { EUploadMimeType } from 'twitter-api-v2';
import { twitterClient } from './client';

export default async function handler(req, res) {
  if (req.method === "GET") {
    const dev = process.env.NODE_ENV !== 'production';
    const serverUrl = dev ? 'http://localhost:3000' : 'https://bot-monorepo.vercel.app';
    const { searchParams } = new URL(`${serverUrl}${req.url}`);
    const castHash = searchParams.get("castHash");
    const reply = searchParams.get("reply");
    const tweetContent = req.body;

    const searchcasterUrl = "https://searchcaster.xyz/api/search?merkleRoot=";
    const searchcasterResponse = await fetch(`${searchcasterUrl}${castHash}`);
    const allCasts = await searchcasterResponse.json();
    const totalCasts = allCasts.meta.count;
    const castImageLink = allCasts.casts[totalCasts - 1].body.data.image;
    let castImageMediaId;

    // also tweet out the image embedded in cast
    if (castImageLink) {
      const imageData = await fetch(castImageLink);
      const imageArrayBuffer = await imageData.arrayBuffer();
      const imageBuffer = Buffer.from(imageArrayBuffer);
      castImageMediaId = await twitterClient.v1.uploadMedia(imageBuffer, { mimeType: EUploadMimeType.Png });
    }

    let imageData;
    if (reply) {
      console.log('with reply');
      imageData = await fetch(`${serverUrl}/api/farcaster/og?castHash=${castHash}&parent=true`);
    } else {
      console.log('without reply');
      imageData = await fetch(`${serverUrl}/api/farcaster/og?castHash=${castHash}`);
    }
    const imageArrayBuffer = await imageData.arrayBuffer();
    const imageBuffer = Buffer.from(imageArrayBuffer);
    const mediaId = await twitterClient.v1.uploadMedia(imageBuffer, { mimeType: EUploadMimeType.Png });

    if (castImageLink) {
      await twitterClient.v2.tweet(tweetContent, { media: { media_ids: [mediaId, castImageMediaId] } });
    } else {
      await twitterClient.v2.tweet(tweetContent, { media: { media_ids: [mediaId] } });
    }

    res.status(200).json({ status: 'success' });
  } else {

    res.status(500).json({ status: 'method not allowed' });
  }
}