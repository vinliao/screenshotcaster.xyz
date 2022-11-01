const ethers = require('ethers');
const canonicalize = require('canonicalize');

export default async function handler(req, res) {
  if (req.method === "GET") {
    const wallet = ethers.Wallet.fromMnemonic('');

    const timestampMs = Date.now();
    const expireTimestampMs = timestampMs + 30000;
    console.log(timestampMs);

    const payload = canonicalize({
      method: 'generateToken',
      params: {
        timestamp: timestampMs,
        expiresAt: expireTimestampMs
      },
    });

    const signature = Buffer.from(ethers.utils.arrayify(await wallet.signMessage(payload))).toString('base64');
    const fullSignature = `eip191:${signature}`;
    console.log(`Self-signed bearer token:\n${fullSignature}`);

    const recoveredAddress = ethers.utils.recoverAddress(
      ethers.utils.hashMessage(payload),
      ethers.utils.hexlify(Buffer.from(fullSignature.split(':')[1], 'base64'))
    );

    console.log(`Valid signature? ${recoveredAddress === wallet.address}`);

    const result = await fetch('https://api.farcaster.xyz/v2/auth', {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${fullSignature}`
      },
      body: payload
    });

    const apiData = await result.json()
    console.log(apiData)

    res.status(200).json({ status: 'success', key: fullSignature });

  }
}