import { Db, MongoCallback, UpdateWriteOpResult } from 'mongodb';
import YoutuberChannel, { Entry } from '../../../youtuber/src/data-types/Channel.type';
import { Video } from '../models/Channel.model';

function getCollection(db: Db) {
  return db.collection('channels');
}

function youtuberVideoAdapter(videos: Entry[]): Video[] {
  return videos?.map<Video>((video) => ({
    id: video['yt:videoId'],
    title: video.title,
    description: video['media:group']['media:description'],
    publishDate: new Date(video.published).getTime(),
    thumbnail: video['media:group']['media:thumbnail'].$.url,
    author: {
      name: video.author.name[0],
      id: video['yt:channelId'],
    },
  }));
}

function getLatestVideo(db: Db, channel: YoutuberChannel): Promise<Video> {
  return new Promise((resolve, reject) => {
    getCollection(db)
      // .find({}, { videos: { $slice: -1 } })
      .aggregate([{ $match: { id: channel.feed.id } }, { $project: { video: { $slice: ['$videos', -1] } } }])
      // .limit(1)
      // .sort({ $natural: -1 })
      .next(((err, doc) => {
        if (err) {
          reject(err);
        }

        resolve(doc);
      }) as MongoCallback<Video>);
  });
}

export function saveChannel({ db, channel }: { db: Db; channel: YoutuberChannel }): Promise<UpdateWriteOpResult> {
  return getLatestVideo(db, channel).then((video) => {
    let index = 0;

    if (video) {
      index = channel.feed.entries.findIndex((entry) => entry['yt:videoId'] === video.id);
    }

    return getCollection(db).updateOne(
      { id: channel.feed['yt:channelId'] },
      { $push: { videos: { $each: youtuberVideoAdapter(channel.feed.entries.slice(index + 1)) } } },
      { upsert: true },
    );
  });
}
