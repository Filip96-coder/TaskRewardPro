import Usuario from "./usuario.js";
import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  
});

const Admin = Usuario.discriminator("Admin", adminSchema);
export default Admin;