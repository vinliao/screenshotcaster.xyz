import TextareaAutosize from 'react-textarea-autosize';
import { useState } from 'react';

export default function Home() {
  const [tweetInput, setTweetInput] = useState("");
  const [castHash, setCastHash] = useState("");

  async function sendTweet() {
    const dev = process.env.NODE_ENV !== 'production';
    const serverUrl = dev ? 'http://localhost:3000' : 'https://bot-monorepo.vercel.app';
    const fetchUrl = `${serverUrl}/api/farcaster/tweet/${castHash}`;


    await fetch(fetchUrl, {
      method: "POST",
      body: tweetInput
    });

    setTweetInput("");
    setCastHash("");
  }

  return (
    <div className="max-w-md mx-auto text-pink-800 py-4">
      <TextareaAutosize className="p-2 block w-full rounded-t-md border-pink-200 shadow-sm focus:border-pink-300 focus:ring-inset focus:ring-pink-300 focus:ring-opacity-50 placeholder-gray-300" placeholder="cc @twitterhandle" rows={3}
        onChange={(e) => setTweetInput(e.target.value)}
        value={tweetInput}
        onKeyDown={(e) => {
          if (e.key == "Enter" && e.ctrlKey) {
            sendTweet();
          }
        }}
      ></TextareaAutosize>
      <div className="flex shadow-sm">
        <input type="text" className="p-2 flex-1 border-l border-b border-pink-200 rounded-bl-md focus:border-pink-300 focus:ring-inset focus:ring-pink-300 focus:ring-opacity-50 placeholder-gray-300" placeholder="Cast hash to tweet: 0xf038abb..."
          onChange={(e) => setCastHash(e.target.value)}
          value={castHash}
          onKeyDown={(e) => {
            if (e.key == "Enter" && e.ctrlKey) {
              sendTweet();
            }
          }}
        />
        <button className="font-mono bg-pink-300 rounded-br-md py-2 px-4 hover:bg-pink-600 hover:text-pink-50 transition focus:outline-none" onClick={() => {
          sendTweet();
        }}>Cast</button>
      </div>
    </div>
  );
}
