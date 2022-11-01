import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    // change @launch to @tweet
    const searchcasterResponse = await fetch('https://searchcaster.xyz/api/search?text=@perl&count=5');
    const data = await searchcasterResponse.json();
    const casts = data.casts;
    let dbCasts = [];

    // call data from supabase
    // [parentMerkle, merkleRoot, twitterLink]
    const { data: supabaseData, error } = await supabase
      .from('farcaster-twitter-bot')
      .select('parent_merkle');

    supabaseData.forEach(oneSupabaseData => {
      dbCasts.push(oneSupabaseData.parent_merkle);
    });


    // fill these two arrays by comparing data from supabase and the casts
    let toBeTweeted = [];
    let hasBeenTweeted = [];

    casts.forEach(async cast => {
      const castText = cast.body.data.text;
      const parentMerkle = cast.body.data.replyParentMerkleRoot; // turn this into image
      const castMerkle = cast.merkleRoot; // reply the twitter link to this

      if (parentMerkle && castText.startsWith("@launch")) {
        // console.log(castText);
        // console.log(parentMerkle);
        // console.log(castMerkle);

        // if parentMerkle doesn't exist on the db
        if (dbCasts.indexOf(parentMerkle) == -1 && toBeTweeted.indexOf(parentMerkle) == -1) {
          toBeTweeted.push(parentMerkle);
          console.log(parentMerkle);

          const { error } = await supabase
            .from('farcaster-twitter-bot')
            .insert({ cast_merkle: castMerkle, parent_merkle: parentMerkle, twitter_link: 'asdf' });
        }
      }
    });

    const dev = process.env.NODE_ENV !== 'production';
    const serverUrl = dev ? 'http://localhost:3000' : 'https://bot-monorepo.vercel.app';

    toBeTweeted.forEach(async merkle => {
      await fetch(`${serverUrl}/api/farcaster/tweet/${merkle}`, {
        method: "POST"
      });
    });
  }

  res.status(200).json({ status: 'success' });
}