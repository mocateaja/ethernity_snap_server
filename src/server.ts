import express, { Request, Response } from 'express';
import fs from 'fs';
import 'dotenv/config';
import { secureRouter, wrapResponse, selectToken, encrypt, decrypt } from './utils/utility';
import database from './database/router';
import rateLimit from 'express-rate-limit'
import cors from 'cors'

const secret_token = selectToken() || '';

const app = express();


const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 500 // batas 100 permintaan per windowMs
});

const configFile = fs.readFileSync('server.config', 'utf8');
const config = JSON.parse(configFile);
const port = config.port;
const address = config.address;

app.use(express.json());

/* 
  JSON dari sisi klien
  content: {
    data: ...
    ...: ...
  }
*/

app.route('/get/:request')
  .get(async(request: Request, response: Response) => {
    const res = wrapResponse(response);
    await secureRouter(request, response);
    res.send({message: "Method not allowed!"});
  })
  .post(async(request: Request, response: Response) => {
    const preq = request.params.request;
    const res = wrapResponse(response);
    await secureRouter(request, response);

    const { content }: any = request.body;
    const request_data: any = await decrypt(content, secret_token);
    if (request_data === 'failed') {
      return res.status(400).send({ message: "Failed to decrypt data" });
    }
    const decrypted_data = await request_data;
    
    //Purpose for debugging only. Do not activate this code!
    //const request_data:any = await encrypt(JSON.stringify(content), "HALO")
    //res.send(request_data)
  
    if (preq === "images") {
       if (!decrypted_data.offset && !decrypted_data.limit) {
        res.status(404).send({message: "There's something wrong with your body request!"})
      } 
      const data = database.get_all_image({
        offset: decrypted_data.offset, // Diambil dari baris data ke berapa
        limit: decrypted_data.limit // Maksimal banyaknya data di ambil
      });
      const encryptedData = encrypt(data, secret_token);
      res.status(200).send(data);
    } else if (preq === "tags") {
      const data = await encrypt(await database.get_all_tag(), secret_token);
      res.send(data);
    } else if (preq === "search") {
      const data = await encrypt(await database.search_image({ key:decrypted_data.search_key }), secret_token)
      res.send(data);
    } //else if (preq === "start") await database.start() // Hanya utnuk awalan saja! Dan akan segera dihapus setelah tabel dibuat
    else if (preq === "encrypt") {res.status(200).send(await encrypt(request.body, secret_token))}
    else if (preq === "decrypt") {res.status(200).send(await decrypt(content, secret_token))}
    res.status(404).send({message: "Unable to find your request!"})
  })
  
app.use('/get/:request', apiLimiter);
  /* 
  type RequestData = {
  user_name?: string;
  password?: "string";
  
  image_id?: "string";
  image_title?: string;
  sender_id?: number;
  image_description?: string;
  image_data?: string;
  tag_id?: number[];
}; 
Data yang seharusnya dimasukan melalui metode post ke dalam database
*/

app.route('/post/:request')
.post(async(request: Request, response: Response) => {
    const preq = request.params.request;
    const res = wrapResponse(response);
    await secureRouter(request, response);
    
    //const request_data:any = (await encrypt(JSON.stringify(requestData), "HALO"));  // DARI SISI KLIEN  SERBELUM DI ENKRIPSI
    //content = SESUDAH DI ENKRIPSI DAN DIMASUKAN KE DALAM OBJEK YANG BERNAMA content
    //const t:any = await decrypt(request_data, "HALO"); // DARI SISI SERVER
    
    const { content }: any = request.body;
    const request_data: any = await decrypt(content, secret_token);
    const decrypted_data = await request_data;
    /*     
    if (!decrypted_data.data?.user_id) {
      res.status(401).send({ error: "Authentication required. Please log in." })
    }   */
    
    if (preq === "user") {
      const response = await database.add_user({
        user_name: decrypted_data.user_name,
        password: decrypted_data.password,
        created_at: decrypted_data.created_at
      });
      response === "success" ? res.send({message: "Request success!"}) : res.send({message: "Request failed!"})
    } else if (preq === "image") {
      const response = await database.add_image({
        image_id: decrypted_data.image_id,
        title: decrypted_data.title,
        description: decrypted_data?.description || "",
        sender_id: decrypted_data.sender_id,
        tag_id: decrypted_data.tag_id,
        created_at: decrypted_data.created_at,
        data: decrypted_data.data
      });
      response === "success" ? res.send({message: "Request success!"}) : res.send({message: "Request failed!"})
    }

    res.status(404).send({message: "Unable to find your request!"})
  })
  .get(async(request: Request, response: Response) => {
    const res = wrapResponse(response);
    await secureRouter(request, response);
    res.send({message: "Method not allowed!"});
  })
app.use('/post/:request', apiLimiter);

app.listen(port, address, async () => {
  console.log(`Server started at ${address}:${port}`);
});
