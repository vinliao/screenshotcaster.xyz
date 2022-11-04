import { useState } from 'react';
import Link from 'next/link';

export default function About() {
  return (
    <div className="max-w-md mx-auto text-purple-800 py-4 px-2 space-y-3">
      <Link href={"/"} className="font-mono underline">back</Link>
      <p>Welcome to Screenshotcaster!</p>
      <p>You can input a <a href="https://searchcaster.xyz" className='underline'>searchcaster.xyz</a> link, a <a href="https://discove.xyz" className='underline'>discove.xyz</a> link, or a castHash to make a screenshot. You also can access the raw rendering engine by calling <code className='bg-purple-100'>screenshotcaster.xyz/api/farcaster/og?castHash=YOUR_CAST_HASH</code>, and appending <code className='bg-purple-100'>&amp;parent=true</code> at the end will generate a screenshot with parent reply.</p>
      <p>Code is open-sourced at <a href="https://github.com/vinliao/screenshotcaster.xyz" className='underline'>github.com/vinliao/screenshotcaster.xyz</a>. Ping me on Twitter: <a href="https://twitter.com/pixelhacks" className='underline'>twitter.com/pixelhacks</a> or Farcaster: <a href="https://fcast.me/pixel" className='underline'>fcast.me/pixel</a>.</p>
    </div>
  );
}
