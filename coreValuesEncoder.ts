// Based on https://github.com/sym233/core-values-encoder

const values = '富强民主文明和谐自由平等公正法治爱国敬业诚信友善';

const randBin = () => Math.random() >= 0.5;
const isEven = (n: number) => Number.isInteger(n) && (n % 2 === 0);

function strToUtf8(str: string) {
  // return in hex
  const notEncoded = /[A-Za-z0-9\-\_\.\!\~\*\'\(\)]/g;
  const castedUnreservedMarks = str.replace(notEncoded, c => c.codePointAt(0)!.toString(16));
  const castedAllChars = encodeURIComponent(castedUnreservedMarks).replace(/%/g, '').toUpperCase();
  return castedAllChars;
}


function utf8ToStr(utf8: string) {
  const l = utf8.length;
  if (!isEven(l)) {
    // length is not even
    throw new Error(`The length of utf8 string should be even, got "${utf8}" with length of ${l}`);
  }
  const splited = [];
  for (let i = 0; i < l; i++) {
    if (isEven(i)) {
      splited.push('%');
    }
    splited.push(utf8[i]);
  }
  return decodeURIComponent(splited.join(''));
}

function hexToDuo(hexStr: string): number[] {
  // duodecimal in array of number

  // '0'.. '9' -> 0.. 9
  // 'A'.. 'F' -> 10, c - 10    a2fFlag = 10
  //          or 11, c - 6      a2fFlag = 11

  const duo: number[] = [];
  for (let c of hexStr) {
    const n = Number.parseInt(c, 16);
    if (n < 10) {
      duo.push(n);
    } else {
      if (randBin()) {
        duo.push(10);
        duo.push(n - 10);
      } else {
        duo.push(11);
        duo.push(n - 6);
      }
    }
  }
  return duo;
}

function duoToHex(duo: number[]) {
  const hexArr: number[] = [];
  const l = duo.length;
  let i = 0;
  while (i < l) {
    if (duo[i] < 10) {
      hexArr.push(duo[i]);
    } else {
      if (duo[i] === 10) {
        i++;
        hexArr.push(duo[i] + 10);
      } else {
        i++;
        hexArr.push(duo[i] + 6);
      }
    }
    i++;
  }
  return hexArr.map(v => v.toString(16).toUpperCase()).join('');
}

function duoToValues(duo: number[]): string {
  return duo.map(d => values[2 * d] + values[2 * d + 1]).join('');
}

function valuesDecoder(encodedStr: string): string {
  const duo: number[] = [];

  for (let c of encodedStr) {
    const i = values.indexOf(c);
    if (isEven(i)) {
      duo.push(i / 2);
    } else {
      // i is odd or -1
      continue;
    }
  }
  const hexs = duoToHex(duo);
  if (!isEven(hexs.length)) {
    throw new Error(`The length of hexs should be even, got "${hexs}", with length of ${hexs.length}`);
  }
  try {
    return utf8ToStr(hexs);
  } catch (err) {
    return `Decoded failed, ${err}`;
  }
}

function valuesEncoder(str: string) {
  return duoToValues(hexToDuo(strToUtf8(str)));
}

// export { strToUtf8, utf8ToStr, hexToDuo, duoToHex };
export { valuesDecoder, valuesEncoder };
