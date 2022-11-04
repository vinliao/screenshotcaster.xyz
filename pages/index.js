import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from "framer-motion";
import { saveAs } from 'file-saver';

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [imageSrc, setImageSrc] = useState("/default.png");
  const [withReply, setWithReply] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [showDownloadImage, setShowDownloadImage] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

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

  function setReplyChecked() {
    setWithReply(!withReply);
  }

  function imageDoneLoaded() {
    setImageLoading(false);
  }

  function downloadImage() {
    setShowDownloadImage(true);
    saveAs(imageSrc);

    setTimeout(function () {
      setShowDownloadImage(false);
    }, 5000);
  }

  function copyLink() {
    setLinkCopied(true);
    navigator.clipboard.writeText(imageSrc);
    setTimeout(function () {
      setLinkCopied(false);
    }, 2000);
  }

  return (
    <div className="max-w-md mx-auto text-purple-800 py-4 px-1">

      <div className='flex'>
        <div className='flex-1'></div>
        <Link href={"/about"} className="font-mono underline">about</Link>
      </div>

      <label className='mb-1 flex items-center'>
        <input type="checkbox" className="form-checkbox rounded border border-purple-300 text-purple-500 mr-2 focus:ring focus:ring-transparent"
          checked={withReply}
          onChange={setReplyChecked}
        />
        <span className='text-neutral-400'>include parent cast?</span>
      </label>
      <div className="flex shadow-sm">
        <input type="text" className="p-2 flex-1 border border-b-0 border-purple-200 rounded-tl-lg focus:border-purple-300 focus:ring focus:ring-inset focus:ring-purple-300 focus:ring-opacity-50 placeholder-gray-300" placeholder="searchcaster or discove link, or a casthash"
          onChange={(e) => setUserInput(e.target.value)}
          value={userInput}
          onKeyDown={(e) => {
            if (e.key == "Enter" && e.ctrlKey) {
              makeImage();
            }
          }}
        />
        {!imageLoading ?
          <button className="font-mono bg-purple-300 rounded-tr-lg py-2 px-4 hover:bg-purple-600 hover:text-purple-50 transition focus:outline-none" onClick={() => {
            makeImage();
          }}>Make</button>
          :
          <AnimatePresence>
            <motion.button className="font-mono bg-neutral-300 rounded-tr-lg py-2 px-4 focus:outline-none text-neutral-500 hover:pointer-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              exit={{ opacity: 0 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 animate-spin">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
              </svg>
            </motion.button>
          </AnimatePresence>
        }
      </div>

      {imageSrc != "" &&
        <div className='relative mb-5'>
          <AnimatePresence>
            {imageLoading &&
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className='h-full w-full backdrop-blur-md absolute rounded-b-lg'></motion.div>
            }
          </AnimatePresence>
          <img src={imageSrc} alt="" onLoad={imageDoneLoaded} className='rounded-b-lg shadow-sm border border-t-0 border-purple-200' />
        </div>
      }

      {imageSrc != "" && imageSrc != "/default.png" && !imageLoading &&
        <motion.div className="flex space-x-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <button className="font-mono underline focus:outline-none" onClick={downloadImage}>download</button>
          <span> - </span>
          <button className="font-mono underline focus:outline-none"
            onClick={copyLink}
          >copy image link</button>
        </motion.div>
      }

      {showDownloadImage &&
        <span className='text-neutral-400'>downloading...</span>
      }

      {linkCopied &&
        <span className='text-neutral-400'>link copied</span>
      }
    </div >
  );
}
