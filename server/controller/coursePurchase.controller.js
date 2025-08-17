import Stripe from "stripe";
import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import User from "../models/user.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course Not Found",
      });
    }

    // Create a new Course Purchase Record
    const newPurchase = new CoursePurchase({
      courseId,
      userId,
      amount: course.coursePrice,
      status: "pending",
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: course.courseTitle,
              description: course.courseDescription || "Course enrollment",
              images: [course.courseThumbnail],
            },
            unit_amount: Math.round(course.coursePrice * 100), // Ensure integer value
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `https://learnify-hazel.vercel.app/course-progress/${courseId}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://learnify-hazel.vercel.app/course-detail/${courseId}`,
      metadata: {
        courseId: courseId.toString(),
        userId: userId.toString(),
      },
      shipping_address_collection: {
        allowed_countries: ["IN"],
      },
      expires_at: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiration
    });

    if (!session.url) {
      return res.status(400).json({ 
        success: false, 
        message: "Error creating Stripe session" 
      });
    }

    // Save purchase record with payment ID
    newPurchase.paymentId = session.id;
    await newPurchase.save();

    return res.status(200).json({
      success: true,
      url: session.url,
    });

  } catch (error) {
    console.error("Checkout session error:", error);
    return res.status(500).json({ 
      success: false,
      message: "Internal server error",
      error: error.message 
    });
  }
};

export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`⚠️ Webhook signature verification failed:`, err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(`🔔 Received event type: ${event.type}`);

  // Handle successful checkout session
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log(`💰 Payment received! Session ID: ${session.id}`);

    try {
      // Find and validate the purchase record
      const purchase = await CoursePurchase.findOne({
        paymentId: session.id
      }).populate('courseId');

      if (!purchase) {
        console.error(`❌ Purchase not found for session: ${session.id}`);
        return res.status(404).json({ error: 'Purchase not found' });
      }

      // Update purchase status and amount
      purchase.status = 'completed';
      if (session.amount_total) {
        purchase.amount = session.amount_total / 100;
      }
      await purchase.save();

      // Update lectures to be previewable
      if (purchase.courseId?.lectures?.length > 0) {
        await Lecture.updateMany(
          { _id: { $in: purchase.courseId.lectures } },
          { $set: { isPreviewFree: true } }
        );
      }

      // Update user's enrolled courses
      await User.findByIdAndUpdate(
        purchase.userId,
        { $addToSet: { enrolledCourses: purchase.courseId._id } },
        { new: true }
      );

      // Update course's enrolled students
      await Course.findByIdAndUpdate(
        purchase.courseId._id,
        { $addToSet: { enrolledStudents: purchase.userId } },
        { new: true }
      );

      console.log(`✅ Successfully processed purchase for user: ${purchase.userId}`);

    } catch (err) {
      console.error(`❌ Error processing webhook:`, err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  res.status(200).json({ received: true });
};

export const getCourseDetailsWithPurchaseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const course = await Course.findById(courseId)
      .populate("creator")
      .populate("lectures");

    if (!course) {
      return res.status(404).json({ 
        success: false,
        message: "Course not found" 
      });
    }

    const purchased = await CoursePurchase.findOne({ 
      userId, 
      courseId,
      status: "completed" 
    });

    return res.status(200).json({
      success: true,
      course,
      purchased: !!purchased
    });

  } catch (error) {
    console.error("Course details error:", error);
    return res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
};

export const getAllPurchasedCourse = async (req, res) => {
  try {
    const purchasedCourses = await CoursePurchase.find({
      status: "completed",
      userId: req.id
    }).populate({
      path: "courseId",
      populate: {
        path: "creator",
        select: "username email avatar"
      }
    });

    return res.status(200).json({
      success: true,
      purchasedCourses: purchasedCourses || []
    });

  } catch (error) {
    console.error("Purchased courses error:", error);
    return res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
};