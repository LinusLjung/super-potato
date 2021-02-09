import Base from "./Base.model";

type Video = {
};

type Channel = Base & {
  id: string;
  videos: Video[];
};

export default Channel;