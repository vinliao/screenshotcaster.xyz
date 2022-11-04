import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link href="https://fonts.googleapis.com/css2?family=DM+Mono&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}