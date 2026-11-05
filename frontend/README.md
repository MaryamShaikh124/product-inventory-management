# Product Inventory Management System

## Project Description

The Product Inventory Management System is a web-based application developed to manage product inventory efficiently. It allows users to add, view, update, delete, search, and filter products.

The application also displays inventory statistics, including total products, total stock, and low-stock products.

## Technologies Used

### Frontend
- React.js
- Vite
- Axios
- HTML
- CSS

### Backend
- Node.js
- Express.js

### Database
- MongoDB Atlas
- Mongoose

## Main Features

- Add new products
- View all products
- Update product information
- Delete products
- Search products by name
- Filter products by category
- Display inventory statistics
- Highlight low-stock products
- Validate product information

## Product Information

Each product contains:

- Product Name
- Category
- Price
- Quantity
- Description

## Installation and Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Backend Setup

```bash
cd product-inventory-management/backend
npm install
```

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend Setup

Open another terminal:

```bash
cd product-inventory-management/frontend
npm install
npm run dev
```

Open the frontend URL displayed in the terminal.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/products | Get all products |
| GET | /api/products/:id | Get a product |
| POST | /api/products | Add a product |
| PUT | /api/products/:id | Update a product |
| DELETE | /api/products/:id | Delete a product |

## Database

The application uses MongoDB Atlas to store product information.

## Author

Student Project