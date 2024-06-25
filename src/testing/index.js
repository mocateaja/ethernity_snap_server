import CryptoJS from "crypto-js";
//const request_data:any = (await encrypt(JSON.stringify(requestData), "HSADDAEASDASD")).toString();  // DARI SISI KLIEN  SERBELUM DI ENKRIPSI
//content = SESUDAH DI ENKRIPSI DAN DIMASUKAN KE DALAM OBJEK YANG BERNAMA content
//const t:any = await decrypt(request_data, "HSADDAEASDASD"); // DARI SISI SERVER

const requestData = {
    request_type: "create_user",
    data: {
        user_name: "Raffi.MA",
        user_id: "fhn8937824fuyre"
    }
  };

async function encrypt(value, secret_token) {
    try {
        const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(value), secret_token).toString(); 
        const base64Encoded = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encryptedData)); 
        return base64Encoded
    } catch (error) {
        return "failed"
  }
}
async function call_api() {
    try {
        const content = await encrypt(requestData, "HALO");
/*          const response = await fetch("http://localhost:5000/tes", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
            body: content
        }); 
        console.log(response.json()); */
        console.log(content);
    } catch (error) {
        console.log(error)
    }
}

await call_api()