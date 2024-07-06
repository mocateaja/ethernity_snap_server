import { config } from 'dotenv';
config();
import express, { Request, Response } from 'express';
import { secureRouter, wrapResponse, selectToken, encrypt, decrypt } from './utils/utility';
import database from './database/router';
import rateLimit from 'express-rate-limit'
import cors from 'cors'

const secret_token = selectToken() || '';

const app = express();

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 
};

app.use(cors(corsOptions)); 

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 500 // batas 100 permintaan per windowMs
});

const port = 8080
const address = "localhost"

app.use(express.json({limit: '50mb'}));

app.get('/', (request: Request, response: Response) => {
  return response.send({
    name: "Ethernity App Server",
    status: "Active",
    defender: "Active",
    version: "v1.1"
  })
})

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
/*  if (request_data === 'failed') {
      return res.status(400).send({ message: "Failed to decrypt data" });
    } Inactivate because still on development*/
    const decrypted_data = await request_data;
    
    //Purpose for debugging only. Do not activate this code!
    //const request_data:any = await encrypt(JSON.stringify(content), "HALO")
    //res.send(request_data)
  
    if (decrypted_data) {
      if (preq === "images") {
        if (!decrypted_data.offset && !decrypted_data.limit) {
          res.status(404).send({message: "There's something wrong with your body request!"})
        } 
        const data = await database.get_all_image({
          offset: decrypted_data.offset,
          limit: decrypted_data.limit 
        });
        const encryptedData = await encrypt(data, secret_token);
        res.status(200).send(encryptedData);
      } else if (preq === "tags") {
        const data = await database.get_all_tag();
        res.status(200).send(data);
      } else if (preq === "search") {
        const data = await database.search_image({ key: decrypted_data.search_key })
        const encryptedData = await encrypt(data, secret_token);
        res.status(200).send(encryptedData);
      } else if (preq === "check_user_account") {
        const data = await database.check_user_account({
          user_id: decrypted_data.user_id,
          password: decrypted_data.password
        })
        const encryptedData = await encrypt(data, secret_token);
        res.status(200).send(encryptedData)
      } else if (preq === "signin") {
        const data = await database.signin({
          user_name: decrypted_data.user_name,
          password: decrypted_data.password
        })
        const encryptedData = await encrypt(data, secret_token);
        res.status(200).send(encryptedData)
      }
      //else if (preq === "start") await database.start() // Hanya utnuk awalan saja! Dan akan segera dihapus setelah tabel dibuat
      //else if (preq === "encrypt") {res.status(200).send(await encrypt(request.body, secret_token))}
      //else if (preq === "decrypt") {res.status(200).send(await decrypt(content, secret_token))}
      res.status(404).send({message: "Unable to find your request!"})
    }
  })
  
app.use('/get/:request', apiLimiter);

app.route('/post/:request')
.post(async(request: Request, response: Response) => {
    const preq = request.params.request;
    const res = wrapResponse(response);
    await secureRouter(request, response);
    
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
      let iDesc: string = "";
      if (decrypted_data.description === "failed") {iDesc = ""} else {iDesc = decrypted_data.description}
      const response = await database.add_image({
        image_id: decrypted_data.image_id,
        title: decrypted_data.title,
        description: iDesc,
        sender_id: decrypted_data.sender_id,
        tag_id: decrypted_data.tag_id,
        created_at: decrypted_data.created_at,
        width: decrypted_data.width,
        height: decrypted_data.height,
        data: decrypted_data.data,
        data_hash: decrypted_data.data_hash
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

app.listen(port, () => {
  console.log(`Server started at:${port}`);
});