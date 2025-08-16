import express from 'express'
import isAuthenticated from "../middleware/isAuthenticated.js"
import { createCheckoutSession, getAllPurchasedCourse, getCourseDetailsWithPurchaseStatus} from '../controller/coursePurchase.controller.js';

const router = express.Router();

router.route("/checkout/create-checkout-session").post(isAuthenticated, createCheckoutSession );
router.route("/course/:courseId/detail-with-status").get(isAuthenticated, getCourseDetailsWithPurchaseStatus);

router.route("/").get(isAuthenticated, getAllPurchasedCourse);

export default router;