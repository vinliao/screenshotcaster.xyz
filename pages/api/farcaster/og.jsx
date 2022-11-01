import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "experimental-edge",
};

export default async function handler(req, res) {
  const { searchParams } = new URL(req.url);
  const castHash = searchParams.get("castHash");

  const searchcasterUrl = "https://searchcaster.xyz/api/search?merkleRoot=";
  const searchcasterResponse = await fetch(`${searchcasterUrl}${castHash}`);
  const allCasts = await searchcasterResponse.json();
  const totalCasts = allCasts.meta.count;
  const castText = allCasts.casts[totalCasts - 1].body.data.text;
  const castUsername = allCasts.casts[totalCasts - 1].body.username;
  const castAvatar = allCasts.casts[totalCasts - 1].meta.avatar;

  // link messes with the css overflow,
  const urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/g;
  const castTextWithoutUrl = castText.replaceAll(urlRegex, "[link]");

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f3e8ff",
        }}
      >
        <div tw="bg-purple-50 flex rounded-3xl shadow-lg">
          <div tw="flex md:items-center w-7/8 p-6">
            <img
              src={castAvatar}
              tw="w-16 h-16 rounded-full mr-5 self-start"
            ></img>
            <div tw="flex flex-col flex-1">
              <span tw="text-purple-400 text-xl">@{castUsername}</span>
              <p tw="text-purple-800 text-2xl" style={{whiteSpace: "pre-wrap"}}>{castTextWithoutUrl}</p>
            </div>
          </div>
        </div>
        <div tw="flex items-center absolute bottom-5 right-5">
          <div tw="text-lg text-purple-600 mr-2">farcaster.xyz</div>
          <img
            width="50"
            height="50"
            src={`https://github.com/farcasterxyz.png`}
            style={{
              borderRadius: 128,
            }}
          />
        </div>
      </div>
    ),
    {
      width: 600,
      height: 800,
    }
  );
}
