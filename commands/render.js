exports.run = (client, message, args) => {
  /*let renderPolygonCount = Math.floor(Math.abs(Math.random() * (20000-1000) + 1000));
  let renderTime = (5 * renderPolygonCount) ^ 3 + 2053;
  message.channel.send('> Rendering Done! It took ' + Math.floor(renderTime/3600) + 'h ' + Math.floor(renderTime % 60) + 'm ' + Math.floor(Math.random() * renderTime % 60) + 's to render ' + renderPolygonCount + ' polygons!');
  console.log(`Render command used by ${message.author.username}`);*/
  message.delete();
}
