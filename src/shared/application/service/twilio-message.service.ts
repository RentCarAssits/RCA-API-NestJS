import { Injectable } from '@nestjs/common';


@Injectable()
export class TwilioMessageService {
  accountSid = 'ACc5948f60a62cbe835a278bf2cbe0ffa2';
  authToken = 'a66a47d949716aeee96a87ecd08c9f3e';
  client = require('twilio')(this.accountSid, this.authToken);

  async sendWsp(req: any): Promise<string> {
    const { request, phone } = req;
    const message = `
    Reserva de vehículo confirmada:
    
    - ID del vehículo: ${request.vehicleId}
    - Fecha de inicio: ${request.startDate}
    - Fecha de fin: ${request.endDate}
    - Precio del alquiler: ${request.rentingPrice} ${request.currency}
    - Unidad de alquiler: ${
      request.rentingUnit === 'D' ? 'Diario' : request.rentingUnit
    }
    
    Por favor, asegúrate de revisar todos los detalles.
  `;

    this.client.messages
      .create({
        body: message,
        from: 'whatsapp:+14155238886',
        to: `whatsapp:${phone}`,
      })
      .then((message:any) => console.log(message.sid));

    return 'OK'
  }
}

/*app.post("/twilio", async (req, res) => {
  const accountSid = "ACc5948f60a62cbe835a278bf2cbe0ffa2";
  const authToken = "a66a47d949716aeee96a87ecd08c9f3e";
  const client = require("twilio")(accountSid, authToken);

  const {request,phone} = req.body
  const message = `
  Reserva de vehículo confirmada:
  
  - ID del vehículo: ${request.vehicleId}
  - Fecha de inicio: ${request.startDate}
  - Fecha de fin: ${request.endDate}
  - Precio del alquiler: ${request.rentingPrice} ${request.currency}
  - Unidad de alquiler: ${request.rentingUnit === 'D' ? 'Diario' : request.rentingUnit}
  
  Por favor, asegúrate de revisar todos los detalles.
`;


  client.messages
  .create({
    body: message,
    from: "whatsapp:+14155238886",
    to: `whatsapp:${phone}`
  })
  .then((message) => console.log(message.sid));
  console.log("🚀 ~ file: chat.js:39 ~ app.post ~ req:", req.body);

  res.send("sexo");
});*/
