import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <div className='bg-pink-50 h-screen'>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
