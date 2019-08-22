import { Sinc } from "@sincronia/types";
import memoryFS from "memory-fs";
import webpack from "webpack";
const run: Sinc.PluginFunc = async function(
  context: Sinc.FileContext,
  content: string,
  options: any
): Promise<Sinc.PluginResults> {
  const memFS = new memoryFS();
  let wpOptions = options.webpackConfig as webpack.Configuration;
  wpOptions.entry = context.filePath;
  //console.log(context);
  wpOptions.output = {
    library: context.name,
    libraryTarget: "var",
    libraryExport: "default",
    path: "/",
    filename: "bundle.js"
  };
  wpOptions.devtool = false;
  let compiler = webpack(wpOptions);
  compiler.outputFileSystem = memFS;
  let compilePromise = new Promise<string>((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        reject(err);
        return;
      }
      let outputPath = stats.compilation.outputPath;
      //console.log(stats);
      let test = memFS.readdirSync("/");
      //console.log(test);
      resolve(memFS.readFileSync("/bundle.js", "utf-8"));
    });
  });
  try {
    let output = await compilePromise;
    //console.log(output);
    return {
      output,
      success: true
    };
  } catch (e) {
    throw new Error();
  }
};

export { run };
