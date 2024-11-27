// import { useState } from 'react';
// import './App.css';
// import Welcome from './component/Welcome';
// import About from './component/About';
// import Header from './component/Header';
// import Login from './component/login';  // Ensure this is correctly imported
// import Layout from './Layout';         // Ensure this is correctly imported
// import Signup from './component/Signup';        // Ensure this is correctly imported
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// function App() {
//   const [count, setCount] = useState(0);

//   return (
//     <BrowserRouter>
//     <Header />
//         <Router>
//       <Routes>
//         <Route path="/" element={<Layout />}>
//           <Route index element={<Welcome />} />
//           <Route path="/about" element={<About />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />
//         </Route>
//       </Routes>
//     </Router>
//   </BrowserRouter>
//   );
// }

// export default App;



import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Header from './component/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import Home from './pages/Home';
import Form from './component/Form';
import UserForm from '/src/User';
import CreateUserForm from '/src/CreateUser';
import UpdateUserForm from '/src/UpdateUser';
import NotFound from './pages/NotFound';
import ProtectedRoute from './component/ProtectedRoute';
import Layout from './Layout'
import CrudProduct from './pages/panel/CrudProduct'
import CrudCategory from './pages/panel/CrudCategory'
import CrudUser from './pages/panel/CrudUser'
import AllProduct from './pages/panel/AllProduct'
import Cart from './pages/panel/Cart'
import Order from './pages/panel/Order'
import Charts from './pages/panel/Charts'
import MyProfile from './pages/panel/MyProfile';  // Adjust this path as needed
import OrderStatus from './pages/panel/OrderStatus';  // Adjust this path as needed

// import Products from "./pages/panel/Products";
// import Categories from "./pages/panel/Categories";
// import Orders from "./pages/panel/Orders";
// import AddProduct from "./pages/panel/AddProduct";
// import EditeProduct from "./pages/panel/EditeProduct";
// import Cart from "./pages/cart/Cart";
// import Wishlist from "./pages/panel/Wishlist";
// import Reviews from "./pages/panel/Reviews";



function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

// function App() {
//   return (
//     <BrowserRouter>
//       <Header />
//       <Routes>
//         <Route path="/" element={<Landing />} />
//                {/* Protected routes */}
//                <Route
//           path="/home"
//           element={
//             <ProtectedRoute>
//               <Home />
//             </ProtectedRoute>
//           }
//           />

//         <Route path="/login" element={<Login />} />
//         <Route path="/logout" element={<Logout />} />
//         {/* <Route path="/home" element={<Home />} /> */}
//         <Route path="/register" element={<RegisterAndLogout />} />
//         <Route path="/admin" element={<Admin />} />
//         <Route path="/user" element={<UserForm />} />
// <Route path="/createuser" element={<CreateUserForm />} />
// <Route path="/update" element={<UpdateUserForm />} />

//    <Route path="*" element={<NotFound />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>

      <Routes>

        {/* <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        /> */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/crud/product" element={<CrudProduct />} />
        <Route path="/crud/category" element={<CrudCategory />} />
        <Route path="/crud/users" element={<CrudUser />} />
        <Route path="/products" element={<AllProduct />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/Order" element={<Order />} />
        <Route path="/charts" element={<Charts />} />
        <Route path="/MyProfile" element={<MyProfile />} />
        <Route path="/OrderStatus" element={<OrderStatus />} />
        

        

        







        <Route path="/" element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<RegisterAndLogout />} />
          <Route path="/user" element={<UserForm />} />
          <Route path="/createuser" element={<CreateUserForm />} />
          <Route path="/update" element={<UpdateUserForm />} />
          <Route path="*" element={<NotFound />} />
        </Route>



      </Routes>
    </BrowserRouter>
  );
}

export default App;