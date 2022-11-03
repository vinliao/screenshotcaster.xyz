import { useState } from 'react';
import Link from 'next/link';
import { saveAs } from 'file-saver';
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [tweetInput, setTweetInput] = useState("");
  const [userInput, setUserInput] = useState("");
  const [imageSrc, setImageSrc] = useState("");
  const [withReply, setWithReply] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  function callImageAPI(castHash) {
    console.log(`making image ${castHash}`);
    const dev = process.env.NODE_ENV !== 'production';
    const serverUrl = dev ? 'http://localhost:3000' : 'https://bot-monorepo.vercel.app';
    let imageUrl;

    if (withReply) {
      imageUrl = `${serverUrl}/api/farcaster/og?castHash=${castHash}&parent=true`;
    } else {
      imageUrl = `${serverUrl}/api/farcaster/og?castHash=${castHash}`;
    }

    setImageSrc(imageUrl);
  }

  function isCastHash(inputString) {
    if (inputString.length == 66 && inputString.startsWith('0x')) return true;
    return false;
  }

  async function makeImage() {
    setImageLoading(true);
    if (isCastHash(userInput)) {
      callImageAPI(userInput);
    } else {
      const url = new URL(userInput);
      if (url.host == 'www.searchcaster.xyz' || url.host == 'searchcaster.xyz') {
        const { searchParams } = new URL(userInput);
        const searchcasterCastHash = searchParams.get("merkleRoot");
        if (isCastHash(searchcasterCastHash)) callImageAPI(searchcasterCastHash);
      } else if (url.host == "www.discove.xyz" || url.host == 'discove.xyz') {
        const discoveCastHash = url.pathname.replace('/casts/', '');
        if (isCastHash(discoveCastHash)) callImageAPI(discoveCastHash);
      }
    }
  }

  async function sendTweet() {
    const dev = process.env.NODE_ENV !== 'production';
    const serverUrl = dev ? 'http://localhost:3000' : 'https://bot-monorepo.vercel.app';
    let fetchUrl;

    if (withReply) {
      fetchUrl = `${serverUrl}/api/farcaster/tweet?castHash=${castHashForTweeting}&parent=true`;
    } else {
      fetchUrl = `${serverUrl}/api/farcaster/tweet?castHash=${castHashForTweeting}`;
    }

    console.log(fetchUrl);
    // await fetch(fetchUrl, {
    //   method: "POST",
    //   body: tweetInput
    // });

    // setUserInput('');
    // setTweetInput('');
    // setImageSrc('');
  }

  function setReplyChecked() {
    setWithReply(!withReply);
  }

  function imageDoneLoaded() {
    setImageLoading(false);
  }

  function downloadImage() {
    saveAs(imageSrc, 'image.png');
  }

  return (
    <div className="max-w-md mx-auto text-pink-800 py-4">

      <div className='flex'>
        <div className='flex-1'></div>
        <Link href={"/about"} className="font-mono underline">about</Link>
      </div>

      <label className='mb-2 flex items-center'>
        <input type="checkbox" className="form-checkbox rounded border border-pink-300 text-pink-500 mr-2 focus:ring focus:ring-transparent"
          checked={withReply}
          onChange={setReplyChecked}
        />
        <span className='text-neutral-400'>include parent?</span>
      </label>
      <div className="flex shadow-sm mb-5">
        <input type="text" className="p-2 flex-1 border border-pink-200 rounded-l-md focus:border-pink-300 focus:ring focus:ring-inset focus:ring-pink-300 focus:ring-opacity-50 placeholder-gray-300" placeholder="searchcaster or discove link, or a casthash"
          onChange={(e) => setUserInput(e.target.value)}
          value={userInput}
          onKeyDown={(e) => {
            if (e.key == "Enter" && e.ctrlKey) {
              makeImage();
            }
          }}
        />
        {!imageLoading ?
          <button className="font-mono bg-pink-300 rounded-r-md py-2 px-4 hover:bg-pink-600 hover:text-pink-50 transition focus:outline-none" onClick={() => {
            makeImage();
          }}>Make</button>
          :
          <button className="font-mono bg-neutral-300 rounded-r-md py-2 px-4 focus:outline-none text-neutral-500 hover:pointer-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 animate-spin">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
            </svg>
          </button>
        }
      </div>

      {imageSrc != "" &&
        <div className='relative'>
          <AnimatePresence>
            {imageLoading &&
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className='h-full w-full backdrop-blur-md absolute'></motion.div>
            }
          </AnimatePresence>
          <img src={imageSrc} alt="" onLoad={imageDoneLoaded} className='rounded-t-2xl' />
        </div>
      }

      {imageSrc != "" && !imageLoading &&
        <div className="flex">
          <button className="font-mono bg-pink-300 rounded-b-2xl py-2 px-4 hover:bg-pink-600 hover:text-pink-50 transition focus:outline-none flex-1" onClick={() => {
            downloadImage();
          }}>download</button>
        </div>
      }

      {/* {imageSrc != "" &&
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
      } */}
    </div>
  );
}
