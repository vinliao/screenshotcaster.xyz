import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "experimental-edge",
};

export default function handler(req, res) {
  const { searchParams } = new URL(req.url);
  const merkleRoot = searchParams.get("merkleRoot");

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
            <div tw="w-16 h-16 bg-purple-300 rounded-full mr-5 self-start"></div>
            <div tw="flex flex-col flex-1">
              <span tw="text-purple-400 text-xl">@handlename</span>
              <span tw="text-purple-800 text-2xl font-bold">
                hm ya gp gotta think on it more also feel free to dc if you
                wanna chat ab them :)
              </span>
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
      height: 600,
    }
  );
}
