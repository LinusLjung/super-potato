type Attributes<T> = {
  $: T;
};

type XMLAttributes = {
  xmlns: string;
  'xmlns:media': string;
  'xmlns:yt': string;
};

type Author = {
  name: string[];
  uri: string[];
};

type Link = Attributes<{
  href: string;
  rel: string;
}>;

type MediaStarRating = Attributes<{
  average: number;
  count: number;
  max: number;
  min: number;
}>;

type MediaStatistics = Attributes<{
  views: number;
}>;

type MediaCommutity = {
  'media:starRating': MediaStarRating;
  'media:statistics': MediaStatistics;
};

type MediaContent = Attributes<{
  height: number;
  type: string;
  url: string;
  width: number;
}>;

type MediaThumbnail = Attributes<{
  height: number;
  url: string;
  width: number;
}>;

type MediaGroup = {
  'media:community': MediaCommutity;
  'media:content': MediaContent;
  'media:description': string;
  'media:thumbnail': MediaThumbnail;
  'media:title': string;
};

export type Entry = {
  author: Author;
  id: string;
  links: Link[];
  'media:group': MediaGroup;
  published: string;
  title: string;
  updated: string;
  'yt:channelId': string;
  'yt:videoId': string;
};

type Channel = {
  feed: {
    $: XMLAttributes;
    author: Author;
    entries: Entry[];
    id: string;
    links: Link[];
    published: string;
    title: string;
    'yt:channelId': string;
  };
};

export default Channel;
