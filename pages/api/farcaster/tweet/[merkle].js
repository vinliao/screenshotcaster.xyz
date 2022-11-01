import { EUploadMimeType } from 'twitter-api-v2';
import { twitterClient } from './client';

export default async function handler(req, res) {
  if (req.method === "POST") {
    const dev = process.env.NODE_ENV !== 'production';
    const serverUrl = dev ? 'http://localhost:3000' : 'https://bot-monorepo.vercel.app/';
    const { merkle } = req.query;

    const searchcasterUrl = "https://searchcaster.xyz/api/search?merkleRoot=";
    const searchcasterResponse = await fetch(`${searchcasterUrl}${merkle}`);
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

    const imageData = await fetch(`${serverUrl}/api/farcaster/og?merkleRoot=${merkle}`);
    const imageArrayBuffer = await imageData.arrayBuffer();
    const imageBuffer = Buffer.from(imageArrayBuffer);
    const mediaId = await twitterClient.v1.uploadMedia(imageBuffer, { mimeType: EUploadMimeType.Png });

    if (castImageLink) {
      await twitterClient.v2.tweet(``, { media: { media_ids: [mediaId, castImageMediaId] } });
    } else {
      await twitterClient.v2.tweet(``, { media: { media_ids: [mediaId] } });
    }

    // tweet() function above returns twitter id and the link
    // can be used to reply and stuff
    // const twitterLink = twitterResponse.data.text;
    // maybe the cast reply should happen here?

    res.status(200).json({ status: 'success' });
  } else {

    res.status(500).json({ status: 'method not allowed' });
  }
}