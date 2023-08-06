import { customAlphabet } from "nanoid";

const humanReadbleAlphabet = "123456789CDFHKLMNPRTY";

//@ts-ignore
const nanoidGeneratorCache = [];
export const humanReadableNanoid = (length = 4) => {
  //@ts-ignore

  if (!nanoidGeneratorCache[length]) {
    nanoidGeneratorCache[length] = customAlphabet(humanReadbleAlphabet, length);
  }
  //@ts-ignore

  return nanoidGeneratorCache[length]();
};
