import { useState } from 'react';

export default function Home() {
  const [tweetInput, setTweetInput] = useState("");
  const [castHash, setCastHash] = useState("");
  const [imageSrc, setImageSrc] = useState("");
  const [withReply, setWithReply] = useState(false);

  async function makeImage() {
    const dev = process.env.NODE_ENV !== 'production';
    const serverUrl = dev ? 'http://localhost:3000' : 'https://bot-monorepo.vercel.app';
    let imageUrl;

    if (withReply) {
      imageUrl = `${serverUrl}/api/farcaster/og?castHash=${castHash}&reply=true`;
    } else {
      imageUrl = `${serverUrl}/api/farcaster/og?castHash=${castHash}`;
    }

    setImageSrc(imageUrl);
  }

  async function sendTweet() {
    const dev = process.env.NODE_ENV !== 'production';
    const serverUrl = dev ? 'http://localhost:3000' : 'https://bot-monorepo.vercel.app';
    let fetchUrl;

    if (withReply) {
      fetchUrl = `${serverUrl}/api/farcaster/tweet?castHash=${castHash}&reply=true`;
    } else {
      fetchUrl = `${serverUrl}/api/farcaster/tweet?castHash=${castHash}`;
    }

    await fetch(fetchUrl, {
      method: "POST",
      body: tweetInput
    });

    setCastHash('');
    setTweetInput('');
    setImageSrc('');
  }

  function setReplyChecked() {
    setWithReply(!withReply);
  }

  return (
    <div className="max-w-md mx-auto text-pink-800 py-4">
      <div className='mb-2 flex items-center'>
        <input type="checkbox" className="form-checkbox rounded text-pink-500 mr-2 focus:border-0 active:border-0"
          checked={withReply}
          onChange={setReplyChecked}
        />
        <span>include reply?</span>
      </div>
      <div className="flex shadow-sm mb-5">
        <input type="text" className="p-2 flex-1 border border-pink-200 rounded-l-md focus:border-pink-300 focus:ring focus:ring-inset focus:ring-pink-300 focus:ring-opacity-50 placeholder-gray-300" placeholder="Cast hash to tweet: 0xf038abb..."
          onChange={(e) => setCastHash(e.target.value)}
          value={castHash}
          onKeyDown={(e) => {
            if (e.key == "Enter" && e.ctrlKey) {
              makeImage();
            }
          }}
        />
        <button className="font-mono bg-pink-300 rounded-r-md py-2 px-4 hover:bg-pink-600 hover:text-pink-50 transition focus:outline-none" onClick={() => {
          makeImage();
        }}>Make</button>
      </div>

      {imageSrc != "" &&
        <img src={imageSrc} alt="" className='rounded-t-2xl' />
      }

      {imageSrc != "" &&
        <div className="flex">
          <input type="text" className="p-2 flex-1 border-l border-b border-pink-200 rounded-bl-2xl focus:outline-none focus:border-pink-300 focus:ring-inset focus:ring-pink-300 focus:ring-opacity-50 placeholder-gray-300" placeholder="by @whatever cc @placeholder"
            onChange={(e) => setTweetInput(e.target.value)}
            value={tweetInput}
            onKeyDown={(e) => {
              if (e.key == "Enter" && e.ctrlKey) {
                sendTweet();
              }
            }}
          />
          <button className="font-mono bg-pink-300 rounded-br-2xl py-2 px-4 hover:bg-pink-600 hover:text-pink-50 transition focus:outline-none" onClick={() => {
            sendTweet();
          }}>Tweet</button>
        </div>
      }
    </div>
  );
}
