import mongoose from "mongoose"

const submissionSchema = new mongoose.Schema({
  task: { type: mongoose.Schema.Types.ObjectId, ref: "Tarea", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
  claimed: { type: Boolean, default: false },
  filePath: { type: String, required: true },
  originalName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  status: { type: String, enum: ["Pendiente", "Aprobada", "Rechazada"], default: "Pendiente" },
  feedback: { type: String }
}, { timestamps: true })

export default mongoose.model("Submission", submissionSchema)
