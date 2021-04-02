import { Compiler } from 'webpack';
import { writeFile } from 'fs';
import * as path from 'path';

type Options = {
  outFile: string;
  outDir: string;
};

class GetAssetsPlugin {
  constructor(options: Partial<Options> = {}) {
    this.options = {
      outFile: 'assets.json',
      outDir: '.',
      ...options,
    };
  }

  options: Options;

  apply(compiler: Compiler) {
    compiler.hooks.afterDone.tap('GetAssetsPlugin', (stats) => {
      const assets: string[] = [];

      Object.values(stats.toJson().entrypoints || {}).forEach((entrypoint) => {
        entrypoint.assets?.forEach((asset) => assets.push(asset.name));
      });

      writeFile(path.join(this.options.outDir, this.options.outFile), JSON.stringify(assets), () => {});
    });
  }
}

module.exports = GetAssetsPlugin;
