// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { updateUserAddress } from "../actions/account";
// import { useForm } from "react-hook-form";
// import { createOrder } from "../actions/orders";
// import { showAddressModal } from "../actions/addressModal";
// import { useNavigate } from "react-router-dom";
// import EditIcon from "@mui/icons-material/Edit";
// import LoadingIndicator from "../components/LoadingIndicator/LoadingIndicator";

// function Checkout() {
//   const {
//     register,
//     handleSubmit,
//     watch,

//     formState: { errors },
//   } = useForm();

//   const navigate = useNavigate();

//   const account = useSelector((state) => state?.account);
//   const orderCreate = useSelector((state) => state?.orderCreate);

//   const { user } = account;
//   const { loading } = orderCreate;

//   const [selectedAddress, setSelectedAddress] = useState({});

//   const savedCartItems = JSON.parse(localStorage.getItem("cartItems"));

//   const province = watch("province");
//   const city = watch("city");
//   const street = watch("street");
//   const postalCode = watch("postalCode");

//   const dispatch = useDispatch();

//   useEffect(() => {
//     console.log("selectedAddress", JSON.stringify(selectedAddress));
//   }, []);

//   useEffect(() => {
//     orderCreate.success && navigate("/ordersuccess");
//     console.log("orderCreate", orderCreate);
//   }, [orderCreate]);

//   useEffect(() => {
//     if (user?.address?.length > 0) {
//       const defaultAddressArr = user?.address?.filter(
//         (address) => address.default == true
//       );
//       setSelectedAddress(defaultAddressArr[0]);
//     }
//     console.log("ad", user?.address);
//   }, [user]);

//   useEffect(() => {
//     console.log("selectedAddress", selectedAddress);
//   }, [selectedAddress]);

//   const onSubmit = (e) => {
//     // e.preventDefault();

//     const address = {
//       province: province,
//       city: city,
//       street: street,
//       postalCode: postalCode,
//     };

//     dispatch(updateUserAddress(address));

//     dispatch(
//       createOrder({
//         orderItems: savedCartItems,
//       })
//     );
//   };

//   const handleOrder = (e) => {
//     e.preventDefault();

//     dispatch(
//       createOrder({
//         orderItems: savedCartItems,
//       })
//     );
//   };

//   return (
//     <div className="relative ">
//       {console.log("REEEDNDERRR")}
//       {user?.address?.length > 0 ? (
//         <div className="p-6">
//           {
//             <div className="p-4 bg-white">
//               <p className="font-bold mb-3">
//                 YOUR ORDER WILL BE SHIPPED TO THIS ADDRESS:
//               </p>
//               <span className="">
//                 {selectedAddress?.province}/{selectedAddress?.city}/
//                 {selectedAddress?.street} / {selectedAddress?.postalCode}
//               </span>
//               <button onClick={() => dispatch(showAddressModal())}>
//                 <span className="ml-4 border-b-2 border-black">
//                   edite or change the address <EditIcon fontSize="inherit" />
//                 </span>
//               </button>
//               <div>
//                 <button
//                   className="bg-black text-white mt-10 p-2 w-[130px] rounded "
//                   onClick={(e) => handleOrder(e)}
//                 >
//                   {loading ? (
//                     <div className="flex justify-center">
//                       <LoadingIndicator />
//                     </div>
//                   ) : (
//                     <span>Submit Order</span>
//                   )}
//                 </button>
//               </div>
//             </div>
//           }
//         </div>
//       ) : user?.address?.length == 0 ? (
//         <div>
//           <div className="px-6 pt-8 flex-grow w-full h-full max-h-full pb-40 md:pb-32 lg:pb-32 xl:pb-32">
//             <form onSubmit={handleSubmit(onSubmit)}>
//               <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
//                 <label className="block text-sm text-gray-700 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium text-sm">
//                   Province
//                 </label>
//                 <div className="col-span-8 sm:col-span-4">
//                   <input
//                     {...register("province", { required: true })}
//                     className="block w-full px-3 py-1 text-sm focus:outline-none dark:text-gray-300 leading-5 rounded-md focus:border-gray-200 border-gray-200 dark:border-gray-600 focus:ring focus:ring-green-300 dark:focus:border-gray-500 dark:focus:ring-gray-300 dark:bg-gray-700 border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
//                     placeholder="Product Title/Name"
//                     label="Product Name"
//                   />
//                   {errors.province && (
//                     <p className="text-red-600">province can't be empty</p>
//                   )}
//                 </div>
//               </div>

//               <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
//                 <label className="block text-sm text-gray-700 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium text-sm">
//                   City
//                 </label>
//                 <div className="col-span-8 sm:col-span-4">
//                   <input
//                     {...register("city", { required: true })}
//                     className="block w-full px-3 py-1 text-sm focus:outline-none dark:text-gray-300 leading-5 rounded-md focus:border-gray-200 border-gray-200 dark:border-gray-600 focus:ring focus:ring-green-300 dark:focus:border-gray-500 dark:focus:ring-gray-300 dark:bg-gray-700 border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
//                     placeholder="Product Title/Name"
//                     label="Product Name"
//                   />
//                   {errors.city && (
//                     <p className="text-red-600">city can't be empty</p>
//                   )}
//                 </div>
//               </div>

//               <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
//                 <label className="block text-sm text-gray-700 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium text-sm">
//                   Street
//                 </label>
//                 <div className="col-span-8 sm:col-span-4">
//                   <input
//                     {...register("street", { required: true })}
//                     className="block w-full px-3 py-1 text-sm focus:outline-none dark:text-gray-300 leading-5 rounded-md focus:border-gray-200 border-gray-200 dark:border-gray-600 focus:ring focus:ring-green-300 dark:focus:border-gray-500 dark:focus:ring-gray-300 dark:bg-gray-700 border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
//                     placeholder="Product Title/Name"
//                     label="Product Name"
//                   />
//                   {errors.street && (
//                     <p className="text-red-600">street can't be empty</p>
//                   )}
//                 </div>
//               </div>

//               <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
//                 <label className="block text-sm text-gray-700 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium text-sm">
//                   Postal code
//                 </label>
//                 <div className="col-span-8 sm:col-span-4">
//                   <input
//                     {...register("postalCode", { required: true })}
//                     className="block w-full px-3 py-1 text-sm focus:outline-none dark:text-gray-300 leading-5 rounded-md focus:border-gray-200 border-gray-200 dark:border-gray-600 focus:ring focus:ring-green-300 dark:focus:border-gray-500 dark:focus:ring-gray-300 dark:bg-gray-700 border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
//                     placeholder="Product Title/Name"
//                     label="Product Name"
//                   />
//                   {errors.postalCode && (
//                     <p className="text-red-600">postalCode can't be empty</p>
//                   )}
//                 </div>
//               </div>

//               <button
//                 className="bg-black text-white p-2 w-fit h-14 rounded "
//                 type="submit"
//               >
//                 Submit Order
//               </button>
//             </form>
//           </div>
//         </div>
//       ) : null}
//     </div>
//   );
// }

// export default Checkout;
