import { Collection, COLLECTION_NAMES, Db, UpdateWriteOpResult, Video } from '@linusljung/use-db';
import YoutuberChannel, { Entry } from '../../../shared/youtuber/data-types/Channel.type';

function getCollection(db: Db): Collection {
  return db.collection(COLLECTION_NAMES.channels);
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
  return new Promise<Video>((resolve, reject) => {
    getCollection(db)
      .aggregate([
        { $match: { id: channel.feed['yt:channelId'] } },
        { $project: { video: { $first: { $slice: ['$videos', -1] } } } },
      ])
      .next((err, doc) => {
        if (err) {
          return void reject(err);
        }

        resolve(doc?.video);
      });
  });
}

export function saveChannel({ db, channel }: { db: Db; channel: YoutuberChannel }): Promise<UpdateWriteOpResult> {
  return getLatestVideo(db, channel).then((video) => {
    let index = -1;

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
