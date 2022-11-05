import { useState } from 'react';
import Link from 'next/link';

export default function About() {
  return (
    <div className="max-w-md mx-auto text-purple-800 py-4 px-2 space-y-3">
      <Link href={"/"} className="font-mono underline">back</Link>
      <p>Welcome to Screenshotcaster!</p>
      <p>You can input a <a href="https://searchcaster.xyz" className='underline'>searchcaster.xyz</a> link, a <a href="https://discove.xyz" className='underline'>discove.xyz</a> link, or a castHash to make a screenshot. For example, try pasting <code className='bg-purple-100 break-all'>https://searchcaster.xyz/search?merkleRoot=0x92d5f9ec93fa62ff3f1c97d4f93f0d0266f6a266aebe1290342ccb5e73638737</code> to the input box and click &quot;Make&quot;. You also can access the raw rendering engine by calling <code className='bg-purple-100 break-all'>https://screenshotcaster.xyz/api/farcaster/og?castHash=YOUR_CAST_HASH</code>, and appending <code className='bg-purple-100'>&amp;parent=true</code> at the end will generate a screenshot with parent reply.</p>
      <p>Code is open-sourced at <a href="https://github.com/vinliao/screenshotcaster.xyz" className='underline'>github.com/vinliao/screenshotcaster.xyz</a>. Ping me on Twitter: <a href="https://twitter.com/pixelhacks" className='underline'>twitter.com/pixelhacks</a> or Farcaster: <a href="https://fcast.me/pixel" className='underline'>fcast.me/pixel</a>.</p>
    </div>
  );
}
