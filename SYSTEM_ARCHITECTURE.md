# System Architecture: Travellers Deal (GetYourGuide Clone)

## 1. High-Level Architecture

The system follows a classic **Client-Server Architecture** decoupled via REST APIs.

### **Frontend (Client)**
-   **Tech Stack**: React.js, Tailwind CSS, Vite.
-   **Structure**: Single Page Application (SPA).
-   **Key Modules**:
    -   **User Portal**: Search, Filtering, Booking Flow, User Profile (`/profile`).
    -   **Vendor Portal**: Dashboard (`/vendor/dashboard`), Experience Management (`/vendor/add`), Booking Management.
    -   **Admin Portal**: User Management, Platform Config (Planned).
-   **State Management**: Context API (`AuthContext`) + Local State.

### **Backend (Server)**
-   **Tech Stack**: Node.js, Express.js.
-   **Pattern**: MVC (Models, Views/Routes, Controllers).
-   **Security**: JWT Authentication, Role-based Middleware (`protect`, `admin`).
-   **Payment Processing**: Razorpay Integration (Order Creation, Verification).
-   **File Storage**: Local/Cloud (currently local uploads served via static middleware).

### **Database**
-   **Tech Stack**: MongoDB (Mongoose ORM).
-   **Relations**: References via `ObjectId` (e.g., `Booking` references `User` and `Experience`).

---

## 2. Database Schema

Based on current implementation + requirements.

### **Users** (`User.js`)
-   `_id`: ObjectId
-   `name`: String
-   `email`: String (Unique)
-   `password`: String (Hashed)
-   `role`: Enum ['traveler', 'vendor', 'admin']
-   `createdAt`: Date

### **Experiences** (`Experience.js`)
-   `_id`: ObjectId
-   `vendor`: Ref('User')
-   `title`: String
-   `description`: String
-   `category`: String
-   `price`: Number
-   `currency`: String
-   `location`: { `city`: String, `country`: String }
-   `images`: [String]
-   `timeSlots`: [String] (e.g., ["10:00", "14:00"])
-   `highlights`: [String]
-   `itinerary`: [{ `title`: String, `description`: String }]
-   `includes`: [String]
-   `whatToBring`: [String]
-   `notSuitableFor`: [String]
-   `meetingPoint`: String
-   `reviews`: [Ref('Review')] (Planned)
-   `averageRating`: Number (Planned)

### **Bookings** (`Booking.js`)
-   `_id`: ObjectId
-   `user`: Ref('User') (The traveler)
-   `experience`: Ref('Experience')
-   `date`: Date
-   `timeSlot`: String
-   `slots`: Number (Number of guests)
-   `totalPrice`: Number
-   `status`: Enum ['pending', 'confirmed', 'cancelled', 'completed']
-   `paymentDetails`: Object (Razorpay ID, etc.)

### **Reviews** (`Review.js`) - *To Be Implemented*
-   `_id`: ObjectId
-   `user`: Ref('User')
-   `experience`: Ref('Experience')
-   `rating`: Number (1-5)
-   `comment`: String
-   `createdAt`: Date

---

## 3. Vendor Flow Diagram

1.  **Registration**: User signs up -> Selects "Become a Vendor" -> Role updated to `vendor`.
2.  **Onboarding**: Vendor logs in -> Redirected to `/vendor/dashboard`.
3.  **Creation**: Click "Create New Listing" -> Fill `AddExperience` Form (Basics, Logistics, Pricing) -> Submit.
4.  **Publishing**: Backend validates -> Saves to DB -> Appears in Search.
5.  **Management**: View Dashboard -> See Active Listings & Recent Bookings.

---

## 4. API Endpoints

### **Auth**
-   `POST /api/users/register`: Register new user/vendor.
-   `POST /api/users/login`: Authenticate and get JWT.
-   `GET /api/users/profile`: Get current user details.

### **Experiences**
-   `GET /api/experiences`: List all (with filters).
-   `GET /api/experiences/:id`: Get details.
-   `POST /api/experiences`: Create new (Vendor only).
-   `PUT /api/experiences/:id`: Update (Vendor only).
-   `DELETE /api/experiences/:id`: Delete (Vendor only).

### **Bookings**
-   `POST /api/bookings`: Create booking (after payment).
-   `GET /api/bookings/mybookings`: Traveler history.
-   `GET /api/bookings/vendor`: Vendor's received bookings.

### **Payments**
-   `POST /api/payments/create-order`: Init Razorpay order.
-   `POST /api/payments/verify`: Verify signature.

---

## 5. Roadmap: Closing the Gap

To fully match "GetYourGuide", we need to implement:

1.  **Review System**:
    -   Create `Review` model.
    -   Add "Write a Review" in Booking History (only for completed bookings).
    -   Display ratings on Experience Detail.

2.  **Advanced Availability**:
    -   Current: `timeSlots` are just strings.
    -   Needed: Track `capacity` per slot per date.
    -   Logic: `Checking availability = Total Capacity - Sum(Booked Slots for Date+Time)`.

3.  **Cancellation Policy**:
    -   Add `cancellationPolicy` field (e.g., "24h prior").
    -   Implement `POST /api/bookings/:id/cancel` with refund logic.

4.  **Search & Filters**:
    -   Enhance backend `getExperiences` to filter by Date, Price Range, and Category simultaneously.
