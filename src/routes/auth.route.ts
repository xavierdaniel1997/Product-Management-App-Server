import { registerUser } from '../controller/auth.controller';
import express from 'express';

const route = express.Router();

route.post("/register", registerUser);

export default route;