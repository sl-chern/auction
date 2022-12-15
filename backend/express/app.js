import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import userRouter from "./routes/user.routes.js"
import lotRouter from "./routes/lot.routes.js"

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

app.use("/api/user", userRouter)
app.use("/api/lot", lotRouter)

export default app