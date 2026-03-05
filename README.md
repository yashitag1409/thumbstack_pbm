AksharVault: Personal Book Management System (Frontend)

Thumbstack PBM is a modern Personal Book Management System that allows users to organize, track, and read their book collections efficiently.

Users can:

Manage books

Track reading progress

Organize books by categories

Manage authors

Add tags to books

Mark books as favorites

Read books directly in the platform

The application is built using Next.js App Router with a modern UI and scalable architecture.

🌐 Live Applications

Frontend Application
https://thumbstack-pbm-w286.vercel.app/

Backend API
https://thumbstack-pbm-backend.onrender.com/api/v1/

🛠 Tech Stack
Frontend Framework

Next.js (App Router)

React.js

UI & Styling

Tailwind CSS

Lucide Icons

State Management

Redux Toolkit

API Communication

Axios

Deployment

Vercel

📁 Project Structure
src
│
├── app
│ ├── authors
│ │ └── page.jsx
│ │
│ ├── books
│ │ ├── page.jsx
│ │ └── [id]
│ │ └── page.jsx
│ │
│ ├── categories
│ │ └── page.jsx
│ │
│ ├── favourites
│ │
│ ├── profile
│ │ └── page.jsx
│ │
│ ├── unauthorized
│ │ └── page.jsx
│ │
│ ├── layout.jsx
│ ├── page.jsx
│ └── not-found.jsx
│
├── component
│
│ ├── Auth
│ │ ├── AuthModal.jsx
│ │ ├── LoginForm.jsx
│ │ └── RegisterForm.jsx
│
│ ├── Authors
│ │ ├── Authors.jsx
│ │ ├── AddEditAuthor.jsx
│ │ └── DeleteAuthor.jsx
│
│ ├── Books
│ │ ├── Books.jsx
│ │ ├── AddEditBooks.jsx
│ │ ├── BookDetails.jsx
│ │ ├── BookReader.jsx
│ │ └── DeleteBooks.jsx
│
│ ├── Categories
│ │ ├── Categories.jsx
│ │ ├── AddEditCategory.jsx
│ │ └── DeleteCategory.jsx
│
│ ├── Dashboard
│ │ └── Dashboard.jsx
│
│ ├── Header
│ │ ├── Sidebar.jsx
│ │ └── MobileNav.jsx
│
│ ├── Home
│ │ ├── HomeWrapper.jsx
│ │ ├── MainPage.jsx
│ │ └── SectionSlider.jsx
│
│ ├── Modal
│ │ └── Modal.jsx
│
│ ├── CustomElementsTag
│ │ └── CustomDropdown.jsx
│
│ └── ui
│ └── Button.jsx
│
├── utils
│
│ ├── apis
│ │ ├── authorsApi.js
│ │ ├── booksApi.js
│ │ └── categoriesApi.js
│
│ ├── axios
│ │ └── AxiosInstance.js
│
│ ├── helper
│ │ ├── BASE_URL.js
│ │ └── format.js
│
│ └── redux
│ ├── store.js
│ ├── storage.js
│ └── slices
│ └── authSlice.js
🚀 Project Setup
1️⃣ Install Dependencies
npm install
2️⃣ Run Development Server
npm run dev

Application runs at:

http://localhost:3000
🔗 API Configuration

All API requests are handled using Axios instance.

Axios configuration file:

src/utils/axios/AxiosInstance.js

Base API URL is defined in:

src/utils/helper/BASE_URL.js

Example:

export const BASE_URL =
"https://thumbstack-pbm-backend.onrender.com/api/v1";

Example API call:

axiosInstance.get("/books/all");

Final API endpoint becomes:

https://thumbstack-pbm-backend.onrender.com/api/v1/books/all
🔐 Authentication Flow

Authentication is handled using JWT tokens.

Register

Registration is handled through:

AuthModal → RegisterForm.jsx
Registration Fields
Field Description
name User full name
email User email
countryCode Country dialing code
contact Phone number
password Account password

Example payload:

{
"name": "John Doe",
"email": "john@example.com",
"countryCode": "+91",
"contact": "9876543210",
"password": "password123"
}
Login

Login is handled through:

AuthModal → LoginForm.jsx

Login fields:

Field Description
email Registered email
password User password

After login:

JWT token returned by backend

Stored in Redux store

Protected routes become accessible

Logout

Logout is handled in:

Sidebar.jsx
authSlice.js

Logout process:

Clear Redux authentication state

Remove stored token

Redirect user to homepage

📖 Application Screens
🏠 Home Page

Route:

/

Displays:

Favorite Books

Latest Books

Categories

Authors

Uses component:

SectionSlider.jsx
📚 Books Screen

Route:

/books

Component:

Books.jsx

Features:

Infinite scroll pagination

Search functionality

Status filtering

Tag filtering

Favorite toggle

CRUD operations

📖 Book Details

Route:

/books/[id]

Displays:

Book title

Author

Category

Number of pages

Tags

Reading status

Component:

BookDetails.jsx
📖 Book Reader

Component:

BookReader.jsx

Features:

Page navigation

Page tracking

Reading progress

✍️ Authors Screen

Route:

/authors

Features:

Add author

Edit author

Delete author

Search

Infinite scroll

Components:

Authors.jsx
AddEditAuthor.jsx
DeleteAuthor.jsx
🏷 Categories Screen

Route:

/categories

Features:

Create category

Update category

Delete category

Pagination

Search

Components:

Categories.jsx
AddEditCategory.jsx
DeleteCategory.jsx
❤️ Favorites Screen

Route:

/favourites

Displays books marked as favorites.

👤 Profile Screen

Route:

/profile

Displays:

User information

Logout option

🧩 CRUD Operations
📚 Book CRUD

Create Book

AddEditBooks.jsx

Update Book

AddEditBooks.jsx

Delete Book

DeleteBooks.jsx
✍️ Author CRUD

Create Author

AddEditAuthor.jsx

Update Author

AddEditAuthor.jsx

Delete Author

DeleteAuthor.jsx
🏷 Category CRUD

Create Category

AddEditCategory.jsx

Update Category

AddEditCategory.jsx

Delete Category

DeleteCategory.jsx
📦 State Management

Redux Toolkit is used.

Redux store location:

src/utils/redux/store.js

Authentication slice:

src/utils/redux/slices/authSlice.js
🎨 UI Components

Reusable UI components:

Button.jsx
Modal.jsx
CustomDropdown.jsx
SectionSlider.jsx
📊 Key Features

User authentication

Book management

Author management

Category management

Favorite books

Infinite scroll pagination

Tag system

Search and filtering

Book reader

Responsive UI

🚀 Deployment

Frontend hosted on:

Vercel

Frontend URL:

https://thumbstack-pbm-w286.vercel.app/

Backend hosted on:

Render

Backend API:

https://thumbstack-pbm-backend.onrender.com/api/v1
