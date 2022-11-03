import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <div className='bg-purple-50 h-screen'>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
