import express, { Express } from "express";
import bodyParser from 'body-parser';
import { addGuest, changeGuest, getGuest, listGuests } from "./routes";


// Configure and start the HTTP server.
const port: number = 8088;
const app: Express = express();
app.use(bodyParser.json());
app.get("/api/listGuests", listGuests);
app.post("/api/addGuest", addGuest);
app.get("/api/getGuest", getGuest);
app.post("/api/changeGuest", changeGuest);
app.listen(port, () => console.log(`Server listening on ${port}`));
    