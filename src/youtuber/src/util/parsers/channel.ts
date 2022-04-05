import { ParserOptions, parseStringPromise } from 'xml2js';
import Channel from '../../../../shared/youtuber/data-types/Channel.type';
import asArray from '../asArray';

const parserOptions: ParserOptions = {
  explicitArray: false,
  async: true,
  attrValueProcessors: [
    (value, name) => {
      switch (name) {
        case 'count':
        case 'width':
        case 'height':
        case 'average':
        case 'min':
        case 'max':
        case 'views':
          return Number(value);
      }

      return value;
    },
  ],
  tagNameProcessors: [
    (name) => {
      if (name === 'entry') {
        return 'entries';
      }

      if (name === 'link') {
        return 'links';
      }

      return name;
    },
  ],
};

function parseChannelXml(xmlString: string): Promise<Channel> {
  return parseStringPromise(xmlString, parserOptions).then((xml: Channel) => {
    xml.feed.entries = asArray(xml.feed.entries);
    xml.feed.entries.forEach((entry) => (entry.links = asArray(entry.links)));

    xml.feed.links = asArray(xml.feed.links);

    xml.feed.entries = xml.feed.entries.reverse();

    return xml;
  });
}

export default parseChannelXml;
