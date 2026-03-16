# Implementation Plan: Sea Star Fish E-Commerce Suite

## Project Overview
Transformation of **Sea Star Fish** from a landing page into a full-scale e-commerce platform for luxury aquascaping and premium pet care.

## 1. Database Schema (MongoDB/Mongoose)
- **User**: `name`, `email`, `password`, `role` (admin/customer), `address`, `wishlist`.
- **Product**: `name`, `category` (Fish/Accessory), `subcategory`, `price`, `stock`, `description`, `images[]`, `popularity`, `ratings[]`.
- **Order**: `userId`, `items[]`, `totalAmount`, `status` (Pending/Shipped/Delivered), `paymentStatus`, `trackingId`.
- **Enquiry**: (Existing) Name, Phone, Interest.

## 2. Backend Infrastructure (Node/Express)
- **Auth Service**: JWT-based login/signup for customers and admins.
- **Shop Service**: Advanced filtering (category, price range) and search endpoints.
- **Cart/Order Service**: Logic for processing orders and managing stock levels.
- **Admin Hub**: Secure CRUD for inventory and order fulfillment tracking.

## 3. Frontend Architecture (React)
- **Navigation**: Clean, sticky header with Cart counter and User Profile.
- **Main Shop**: Dynamic grid with category filters and search bar.
- **Product Page**: High-resolution image gallery, stock status, and detailed specs.
- **Checkout Workflow**: Multi-step process (Shipping -> Payment -> Confirmation).
- **Admin ERP Dashboard**:
  - Inventory Management (Add/Edit products).
  - Order Fulfillment (Update status).
  - Sales Analytics (Revenue trends).

## 4. Visual Design System (CSS)
- Extension of the **Midnight Blue & Pearl** palette.
- Implementation of "Glassmorphism" for the checkout and cart drawers.
- Micro-animations for "Add to Cart" and page transitions.

## 5. Implementation Phases
- **Phase 1**: Folder restructuring and Schema expansion.
- **Phase 2**: Product CRUD and Public Shop Grid.
- **Phase 3**: User Auth, Wishlist, and Cart logic.
- **Phase 4**: Checkout, Order Management, and Analytics.
