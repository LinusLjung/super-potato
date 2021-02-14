import Base from './Base.model';

export type Video = {
  id: string;
  title: string;
  description: string;
  publishDate: number;
  thumbnail: string;
  author: {
    name: string;
    id: string;
  };
};

type Channel = Base & {
  id: string;
  videos: Video[];
};

export default Channel;
