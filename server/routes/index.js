import { Router } from "express";
import { authRouter } from "./authRoutes.js";
import { bookingRouter } from "./bookingRoutes.js";
import { documentRouter } from "./documentRoutes.js";
import { lessonRouter } from "./lessonRoutes.js";
import { monitorRouter } from "./monitorRoutes.js";
import { paymentRouter } from "./paymentRoutes.js";
import { quizRouter } from "./quizRoutes.js";
import { studentRouter } from "./studentRoutes.js";
import { userRouter } from "./userRoutes.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/monitors", monitorRouter);
apiRouter.use("/students", studentRouter);
apiRouter.use("/bookings", bookingRouter);
apiRouter.use("/lessons", lessonRouter);
apiRouter.use("/quiz", quizRouter);
apiRouter.use("/payments", paymentRouter);
apiRouter.use("/documents", documentRouter);
