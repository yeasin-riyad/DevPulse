import express, { type Application, type Request, type Response } from 'express'
import cors from 'cors'
import globalErrorHandler from './middleware/globalErrorHandler';
const app:Application = express()

// Built-in Middlewares
app.use(express.json()); 

app.use(
  cors({
    origin: "http://localhost:8000",
  }),
);
app.get('/', (req:Request, res:Response) => {
  res.status(200).json({
    "message":"Welcome to DevPulse API",
    "author":"Yeasin Riyad"
  })
})


// Custom Routes Middleware
// app.use('/api/user',userRouter);
// app.use('/api/profile', profileRoute);
// app.use('/api/auth', authRouter);


// 404 Middleware
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found"
  });
});

// Global Error Handling Middleware
app.use(globalErrorHandler);


export default app;

