import { AppDataSource } from './config/db'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { configDotenv } from 'dotenv'
import { UserRoute } from './routes/user.route'

const app = express()
app.use(express.json())
app.use(cors())
app.use(morgan('combined'))

// app.use(UserService.validateToken)
app.use('/api/users', UserRoute)

configDotenv()
const port = Number(process.env.SERVER_PORT)
AppDataSource.initialize().then(() => {
    console.log("Database connected");

    app.listen(port, () => {
      console.log(`Server running on port: http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });