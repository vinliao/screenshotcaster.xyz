import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "experimental-edge",
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const castHash = searchParams.get("castHash");
  const parent = searchParams.get("parent");

  const searchcasterUrl = "https://searchcaster.xyz/api/search?merkleRoot=";
  const searchcasterResponse = await fetch(`${searchcasterUrl}${castHash}`);
  const allCasts = await searchcasterResponse.json();
  const totalCasts = allCasts.meta.count;
  const theCast = allCasts.casts[totalCasts - 1];
  const castUsername = theCast.body.username;
  const castAvatar = theCast.meta.avatar;
  const castDisplayName = theCast.meta.displayName;

  let castText = theCast.body.data.text;
  // delete this when fix has been merged upstream
  castText = castText.replaceAll("\n\n", "\nᅠ\n"); // LMFAOOOOOOOOOOOOOOOOOOOOOO
  const urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/g;
  const castTextWithoutUrl = castText.replaceAll(urlRegex, "[link]");

  const parentCastHash = theCast.body.data.replyParentMerkleRoot;

  if (parent && parentCastHash) {
    const parentSearchcasterResponse = await fetch(
      `${searchcasterUrl}${parentCastHash}`
    );
    const parentAllCasts = await parentSearchcasterResponse.json();
    const parentTotalCasts = parentAllCasts.meta.count;
    const parentTheCast = parentAllCasts.casts[parentTotalCasts - 1];
    const parentCastUsername = parentTheCast.body.username;
    const parentCastAvatar = parentTheCast.meta.avatar;
    const parentCastDisplayName = parentTheCast.meta.displayName;

    let parentCastText = parentTheCast.body.data.text;
    parentCastText = parentCastText.replaceAll("\n\n", "\nᅠ\n");

    const parentCastTextWithoutUrl = parentCastText.replaceAll(
      urlRegex,
      "[link]"
    );

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
          {/* parent */}
          <div tw="bg-purple-50 flex rounded-t-3xl shadow-lg">
            <div tw="flex md:items-center w-7/8 p-6">
              <img
                src={parentCastAvatar}
                tw="w-16 h-16 rounded-full mr-5 self-start"
              ></img>
              <div tw="flex flex-col shrink">
                <div tw="flex">
                  <span tw="text-neutral-400 text-lg mr-2">
                    {parentCastDisplayName}
                  </span>
                  <span tw="text-neutral-400 text-lg">
                    @{parentCastUsername}
                  </span>
                </div>
                <span
                  tw="text-neutral-400 text-xl"
                  style={{ whiteSpace: "pre-line" }}
                >
                  {parentCastTextWithoutUrl}
                </span>
              </div>
            </div>
          </div>

          {/* the cast */}
          <div tw="bg-purple-50 flex rounded-b-3xl shadow-lg">
            <div tw="flex md:items-center w-7/8 p-6">
              <img
                src={castAvatar}
                tw="w-16 h-16 rounded-full mr-5 self-start"
              ></img>
              <div tw="flex flex-col shrink">
                <div tw="flex">
                  <span tw="text-purple-400 text-xl mr-2">
                    {castDisplayName}
                  </span>
                  <span tw="text-purple-400 text-xl">@{castUsername}</span>
                </div>
                <span
                  tw="text-purple-800 text-2xl"
                  style={{ whiteSpace: "pre-line" }}
                >
                  {castTextWithoutUrl}
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
        height: 1000,
      }
    );
  }

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
            <div tw="flex flex-col shrink">
              <div tw="flex">
                <span tw="text-purple-400 text-xl mr-2">{castDisplayName}</span>
                <span tw="text-purple-400 text-xl">@{castUsername}</span>
              </div>
              <div
                tw="text-purple-800 text-2xl"
                style={{ whiteSpace: "pre-line" }}
              >
                {castTextWithoutUrl}
              </div>
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
