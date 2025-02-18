import { Response } from 'express';
import fs from 'fs'
import CryptoJS from 'crypto-js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import path from 'path';
config({ path: path.resolve(__dirname, '../../../.env.local') });

//////////////////////////////////////////////////////////////////

const generateRandomString = (length: number) => {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

//////////////////////////////////////////////////////////////////

const json = {
  read: async(filePath: string) => {
    try {
      const data = await fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      console.error('Error reading JSON from file:', err);
      return null;
    }
  },
  write: (filePath: string, data: any) => {
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
      console.error('Error writing JSON to file:', err);
    }
  },
};

//////////////////////////////////////////////////////////////////

const wrapResponse = (res: Response) => {
  let sent = false;
  return {
    send: (body: any) => {
      if (!sent && !res.headersSent) {
        sent = true;
        res.send(body);
      }
    },
    status: (code: number) => {
      if (!sent && !res.headersSent) {
        res.status(code);
      }
      return { send: (body: any) => wrapResponse(res).send(body) };
    },
    json: (body: any) => {
      if (!sent && !res.headersSent) {
        sent = true;
        res.json(body);
      }
    },
  };
};

//////////////////////////////////////////////////////////////////

const sendOverloadAllert = (res: Response) => {
  const wrappedRes = wrapResponse(res);
  return wrappedRes.status(429).send({
    message: `Too many requests! Cannot hold more than 1 request in less than ${timeLimitSeconds} seconds!`,
  });
};

//////////////////////////////////////////////////////////////////

const timeLimitSeconds = 1
const ip_json_path = 'data/ip.json';
let spam_status: boolean;

const checkSpam = async(res: Response, userIp: string | string[] | undefined) => {
  const wrappedRes = wrapResponse(res);
  const newTimestamp: number = Math.floor(new Date().getTime() / 1000);
  const data = await json.read(ip_json_path);
  if (!data) {
    wrappedRes.status(500).send({ message: 'Error reading JSON data' });
    spam_status = true;
  }
  spam_status = false;

  const existingIp = data.ip_address.find((item: any) => item.ip === userIp);

  data.ip_address = data.ip_address.filter((item: any) => item.ip !== userIp);

  if (!existingIp) {
    data.ip_address.push({ ip: userIp, timestamp: newTimestamp });
  }

  if (existingIp && newTimestamp - existingIp.timestamp < timeLimitSeconds) {
    spam_status = true;
  } else spam_status = false;

  if (spam_status === true) sendOverloadAllert(res);
  json.write(ip_json_path, data);
};

//////////////////////////////////////////////////////////////////

const secureRouter = async(user_ip: string, res: Response): Promise<void> => {
  const userIp: string | string[] | undefined = user_ip;

  console.log(`Request from ${userIp}`)

  const data = await json.read(ip_json_path);
  if (!data) {
    res.status(500).send({ message: 'Error reading JSON data' });
  }
  if (!data.ip_address) {
    data.ip_address = [];
  }

  await checkSpam(res, userIp);
};

//////////////////////////////////////////////////////////////////

const encrypt = async (value: any, secret_token: string) => {
  try {
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(value), secret_token).toString();
    const base64Encoded = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encryptedData));
    return base64Encoded;
  } catch (error) {
    return 'failed';
  }
};
const decrypt = async (value: any, secret_token: string) => {
  try {
    const base64Decoded = CryptoJS.enc.Base64.parse(value).toString(CryptoJS.enc.Utf8);
    const decryptedData = CryptoJS.AES.decrypt(base64Decoded, secret_token);
    const finalData = JSON.parse(decryptedData.toString(CryptoJS.enc.Utf8));
    return finalData;
  } catch (error) {
    return 'failed';
  }
};

//////////////////////////////////////////////////////////////////

const { PRIMARY_TOKEN, SECONDARY_TOKEN, SECRET_URL } = process.env;

// DANGEROUS! SET LIKE THIS BECAUSE SOME BUG

const selectToken = () => {
  const date = new Date();
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1;
  const uniqueValue = day * 100 + month; 
  return uniqueValue % 2 !== 0 ? PRIMARY_TOKEN : SECONDARY_TOKEN;
};

export const secretURL = SECRET_URL

//////////////////////////////////////////////////////////////////

const timestamp = () => {
  const pad = (num: number): string => num.toString().padStart(2, '0');
  const padMilliseconds = (num: number): string => num.toString().padStart(3, '0');

  const date = new Date();
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  const milliseconds = padMilliseconds(date.getMilliseconds());
  const formattedTimestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
  return formattedTimestamp
}

//////////////////////////////////////////////////////////////////



export { generateRandomString, secureRouter, wrapResponse, selectToken, encrypt, decrypt, timestamp };
