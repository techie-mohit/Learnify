# Learnify

## Description
Learnify is a modern Learning Management System (LMS) designed to help students and instructors manage courses, lectures, and progress online. It provides a seamless experience for course creation, enrollment, and tracking, with a user-friendly interface and secure payment integration.

Deployed at: [https://learnify-hazel.vercel.app/](https://learnify-hazel.vercel.app/)

---

## Features
- User authentication and profile management
- Course creation, editing, and publishing (admin/instructor)
- Secure Stripe payment integration for course purchase
- Student dashboard with enrolled courses and progress tracking
- Rich text editor for course descriptions
- Video lectures and downloadable resources
- Responsive design with dark mode support
- Real-time notifications and feedback (toast messages)
- Admin dashboard for managing courses and lectures

---

## Installation Instructions

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB (local or cloud)

### Backend (Server)
1. Clone the repository:
   ```bash
   git clone https://github.com/techie-mohit/Learnify.git
   cd Learnify/server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add your environment variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend (Client)
1. Navigate to the client folder:
   ```bash
   cd ../client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Visit [http://localhost:5173](http://localhost:5173) in your browser.

---

## Usage
- Register as a student or instructor.
- Instructors can create, edit, and publish courses.
- Students can browse courses, purchase via Stripe, and access course content.
- Track progress and mark lectures as completed.
- Admins can manage users, courses, and content.

---

## Technologies Used
- **Frontend:** React, Vite, Redux Toolkit, React Router, Tailwind CSS, Radix UI, React Quill, Lucide React, Sonner (toast notifications)
- **Backend:** Node.js, Express, MongoDB, Mongoose, Stripe, JWT, Multer, Cloudinary
- **Other:** ESLint, PostCSS

---

## Contributing Guidelines
1. Fork the repository and create your branch.
2. Make your changes and write clear commit messages.
3. Ensure code is linted and tested.
4. Submit a pull request with a detailed description.

---

## License
This project is licensed under the ISC License.

---

## Contact Information
- **Author:** techie-mohit
- **GitHub:** [https://github.com/techie-mohit/Learnify](https://github.com/techie-mohit/Learnify)
- **Deployed App:** [https://learnify-hazel.vercel.app/](https://learnify-hazel.vercel.app/)

---

Feel free to use or contribute to Learnify! If you have any questions or suggestions, please open an issue or contact the author via GitHub.
