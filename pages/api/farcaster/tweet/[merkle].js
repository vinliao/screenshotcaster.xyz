import { EUploadMimeType } from 'twitter-api-v2';
import { twitterClient } from './client';

export default async function handler(req, res) {
  if (req.method === "POST") {
    const dev = process.env.NODE_ENV !== 'production';
    const serverUrl = dev ? 'http://localhost:3000' : 'https://bot-monorepo.vercel.app/';
    const { merkle } = req.query;

    const imageData = await fetch(`${serverUrl}/api/farcaster/og?merkleRoot=${merkle}`);
    const imageArrayBuffer = await imageData.arrayBuffer();
    const imageBuffer = Buffer.from(imageArrayBuffer);
    const mediaId = await twitterClient.v1.uploadMedia(imageBuffer, { mimeType: EUploadMimeType.Png });
    await twitterClient.v2.tweet(``, { media: { media_ids: [mediaId] } });

    res.status(200).json({ status: 'success' });
  } else {

    res.status(500).json({ status: 'method not allowed' });
  }
}