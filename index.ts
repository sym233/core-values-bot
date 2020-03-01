import { HttpsProxyAgent } from 'https-proxy-agent';
const SocksAgent = require('socks5-https-client/lib/Agent') as any;

import botStart from './bot';


function getSocksAgent(socksUrl?: string): any | undefined {
  if (socksUrl) {
    const parseUri = /^(.+\:\/\/)?(.+?)\:(\d+)$/;
    const matched = socksUrl.match(parseUri);
    if (matched && matched[2] && matched[3]) {
      const socksHost = matched[2];
      const socksPort = Number.parseInt(matched[3]);
      console.log('Using Socks Proxy');
      return new SocksAgent({
        socksHost,
        socksPort,
      });
    }
  }
}
function getHttpAgent(httpUrl?: string): any | undefined {
  if (httpUrl) {
    console.log('Using Http Proxy');
    return new HttpsProxyAgent(httpUrl);
  }
}


const token = process.env.TG_BOT_TOKEN;
if (!token) {
  throw new Error('Bot token not set, please check environment variable TG_BOT_TOKEN');
}

const agent = getSocksAgent(process.env.SOCKS_PROXY) 
  || getHttpAgent(process.env.HTTP_PROXY)
  || getHttpAgent(process.env.HTTPS_PROXY);

console.log('Starting bot...');
botStart(token, agent);