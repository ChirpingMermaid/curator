const redis = require('redis');
const geolib = require('geolib');
const bluebird = require('bluebird');
const client = redis.createClient();
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

client.on('error', (err) => {
  console.log('redis error!', err);
});

module.exports = (app, express) => {
  app.get('/getstack', (req, res) => {
    console.log(req.query)
    let seedId = req.query.id;
    let seedTheme = req.query.theme;
    client.hgetallAsync(`gps:${seedId}`).then( (data) => {
      let oppLoc = {
        lat: data.lat > 0 ? -(data.lat) : Math.abs(data.lat),
        long: data.long > 0 ? -(180 - data.long) : 180 - Math.abs(data.long)
      }
      console.log(oppLoc)

    });
    
  });
  app.post('/save', (req, res) => {
    let data = req.body;
    console.log('posting...', data)
    client.sadd(`set:${data.theme}`, data.id);
    
    client.hmset(`gps:${data.id}`, 'lat', data.gps.lat, 'long', data.gps.long, 'url', data.url);
    // TODO: CREATE SORTED SET BY TIME FOR PICTURES
    res.send();
  });
};