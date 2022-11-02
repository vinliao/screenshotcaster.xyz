// import { startPolling } from '@big-whale-labs/botcaster';


export default async function handler(req, res) {

  const botAddress = "0x0076F74CC966fdD705deD40df8aB86604e4b5759";
  const data = await fetch(`https://api.farcaster.xyz/v1/notifications?address=${botAddress}&per_page=10`);
  const casts = await data.json();
  console.log(casts);
  // store notifications id string (merkle root cast hash) in redis
  // compare notification with those strings
  console.log(casts.result.notifications);

  // if (req.method === "GET") {
  //   startPolling(botAddress, (notification) => {
  //     if (notification.type == "cast-reply") {
  //       const reply = notification.replyCast;
  //       // case sensitive?
  //       if (reply.text.startsWith("You")) {
  //         // then do something
  //         console.log(notification);
  //         // what if i just like, then the like is a sign that i've posted the thing?
  //         // less tedious than having to spin up an entire fucking backend loL
  //       }
  //     }
  //   });

  res.status(200).json({ status: 'success' });
}