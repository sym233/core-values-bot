import { valuesEncoder, valuesDecoder } from './coreValuesEncoder';


function assertEq<T>(left: T, right: T) {
  if (left !== right) {
    console.error(`{left !== right!, where left = ${left} and right = ${right}}`);
  }
}


assertEq(
  valuesDecoder('诚信自由公正诚信民主平等爱国诚信民主诚信自由爱国诚信富强诚信平等敬业平等友善爱国法治敬业自由友善自由爱国友善爱国公正诚信富强富强诚信民主法治友善爱国自由友善平等诚信自由爱国友善平等友善敬业富强敬业友善敬业敬业爱国爱国富强友善爱国诚信平等诚信民主诚信文明爱国友善公正和谐文明和谐和谐和谐和谐文明诚信自由'),
  '测试用样例😀，233.'
);


const eg2 = 'No.2 测试用样例😀，233.';
assertEq(
  valuesDecoder(valuesEncoder(eg2)),
  eg2
);

console.log('Test finished');
