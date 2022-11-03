import { useState } from 'react';
import Link from 'next/link';

export default function About() {
  return (
    <div className="max-w-md mx-auto text-purple-800 py-4">
      <Link href={"/"} className="font-mono underline">back</Link>
      <p>Welcome to screenshotcaster!</p>
    </div>
  );
}
