// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { CircularProgress, Grid } from "@mui/material";
// import { useParams } from "react-router";
// import "./AddProduct.css";
// import { getProductById, updateProduct } from "../../actions/products";
// import { useDispatch, useSelector } from "react-redux";
// import "react-toastify/dist/ReactToastify.css";
// import { fetchCategories } from "../../actions/categories";
// import ReactQuill, { Quill } from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import { fetchProductBySection } from "../../api";
// import { SECTIONS } from "../../constants/panelConstants";
// import { useForm } from "react-hook-form";
// import axios from "axios";
// import { string } from "prop-types";
// import LoadingIndicator from "../../components/LoadingIndicator/LoadingIndicator";

// function EditeProduct() {
//   const productDetails = useSelector((state) => state.ProductDetails);
//   const allCategories = useSelector((state) => state.categories);
//   const productsReducer = useSelector((state) => state.products);

//   const { loading } = productsReducer;
//   const { product } = productDetails;
//   const { categories } = allCategories;

//   const quillRef = useRef(null);
//   const dispatch = useDispatch();

//   const [suspention, setSuspention] = useState("");
//   const [material, setMaterial] = useState("");
//   const [brand, setBrand] = useState("");
//   const [category, setCategory] = useState("");
//   const [quantity, setQuantity] = useState("");
//   const [content, setContent] = useState("");
//   const [section, setSection] = useState("");
//   const [allImages, setAllImages] = useState([]);
//   const [variants, setVariants] = useState([]);
//   const { slug } = useParams();
//   const [hotDiscount, setHotDiscount] = useState(null);
//   const [bestSeller, setBestSeller] = useState(null);
//   const [ourOffer, setOurOffer] = useState(null);
//   const [newArrival, setNewArrival] = useState(null);
//   const [mainImageUrl, setMainImageUrl] = useState([]);
//   const [otherImagesUrl, setOtherImagesUrl] = useState([]);
//   const [mainPreview, setMainPreview] = useState("");
//   const [othersPreview, setOthersPreview] = useState([]);
//   const [imgUploadPrc, setimgUploadPrc] = useState(0);
//   const [imgIndex, setImgIndex] = useState(0);
//   const [uploadPrgsModalOpen, setUploadPrgsModalOpen] = useState(false);
//   const [uploadModalThumbs, setUploadModalThumbs] = useState([]);
//   const [variantsLength, setVariantsLength] = useState();

//   const {
//     register,
//     handleSubmit,
//     watch,
//     setError,
//     reset,
//     clearErrors,
//     formState: { errors },
//   } = useForm();

//   const title = watch("title");
//   const mainImgFile = watch("mainimage");
//   const otherImgsFiles = watch("otherImages", []);
//   const price = watch("price", 33);
//   const stock = watch("stock", 1);
//   const size = watch("size", "48cm");

//   useEffect(() => {
//     fetchProductBySection(SECTIONS.Hot_Discount)
//       .then((response) => {
//         console.log("HotDiscount", response.data.products);
//         setHotDiscount(response.data.products);
//       })
//       .catch((error) => {
//         console.log(error);
//       });

//     fetchProductBySection(SECTIONS.Best_Seller)
//       .then((response) => {
//         console.log("BestSeller", response.data.products);
//         setBestSeller(response.data.products);
//       })
//       .catch((error) => {
//         console.log(error);
//       });

//     fetchProductBySection(SECTIONS.New_Arrival)
//       .then((response) => {
//         console.log("newArrival", response.data.products);
//         setNewArrival(response.data.products);
//       })
//       .catch((error) => {
//         console.log(error);
//       });

//     fetchProductBySection(SECTIONS.Our_Offer)
//       .then((response) => {
//         console.log("ourOffer", response.data.products);
//         setOurOffer(response.data.products);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }, []);

//   useEffect(() => {
//     let defaultValues = {};
//     defaultValues.title = product?.title;
//     defaultValues.price = product?.price;

//     reset({ ...defaultValues });
//   }, [product]);

//   useEffect(() => {
//     if (imgIndex == uploadModalThumbs.length - 1 && imgUploadPrc == 100) {
//       setTimeout(() => {
//         setUploadPrgsModalOpen(false);
//         setimgUploadPrc(0);
//         setImgIndex(0);
//       }, 500);
//     }
//   }, [imgUploadPrc]);

//   useEffect(() => {
//     dispatch(getProductById(slug));
//   }, [dispatch]);

//   useEffect(() => {
//     if (product) {
//       setBrand(product.brand);
//       setCategory(product.category);
//       setSection(product.section);
//       setSuspention(product.suspention);
//       setMaterial(product.material);
//       setContent(product.content);
//       setQuantity(product.quantity);
//       setVariants(product.variants);
//       setVariantsLength(product?.variants?.length);
//       setMainPreview(product?.images?.length > 0 && product?.images[0]);
//       setOthersPreview(product?.images?.slice(1));
//       setMainImageUrl(product?.images?.length > 0 && product?.images[0]);
//       setOtherImagesUrl(product?.images?.slice(1));

//       console.log("title", title);
//     }
//   }, [product]);

//   useEffect(() => {
//     dispatch(fetchCategories());
//   }, [dispatch]);

//   useEffect(() => {
//     console.log("mainImgFile", mainImgFile);

//     if (mainImgFile?.length > 0) {
//       const mainImgUrl = URL.createObjectURL(mainImgFile[0]);
//       setMainPreview(mainImgUrl);
//     }
//   }, [mainImgFile]);

//   useEffect(() => {
//     let otherImgsUrls = [];

//     if (otherImgsFiles.length > 0) {
//       for (let i = 0; i < otherImgsFiles.length; i++) {
//         otherImgsUrls.push(URL.createObjectURL(otherImgsFiles[i]));
//       }

//       setOthersPreview(otherImgsUrls);
//     }
//   }, [otherImgsFiles]);

//   useEffect(() => {
//     if (mainImageUrl && otherImagesUrl.length > 0) {
//       setAllImages([mainImageUrl, ...otherImagesUrl]);
//     }
//   }, [mainImageUrl, otherImagesUrl]);

//   const imageUpload = async (files) => {
//     const myUploadProgress = (myFileId) => (progressEvent) => {
//       console.log("myFileId", myFileId);
//       const progress = Math.round(
//         (progressEvent.loaded * 100) / progressEvent.total
//       );

//       setimgUploadPrc(progress);

//       console.log("imgUploadPr", imgUploadPrc);
//     };

//     let imagesUrls = [];

//     for (var i = 0; i < files.length; i++) {
//       setImgIndex(i);
//       const formData = new FormData();
//       formData.append("images", files[i]);

//       var config = {
//         headers: { "Content-Type": "multipart/form-data" },
//         onUploadProgress: myUploadProgress(files[i].name),
//       };

//       const response = await axios.post(
//         `https://bikershop.liara.run/products/imageUpload`,
//         formData,
//         config
//       );

//       if (i != files.length - 1) {
//         setimgUploadPrc(0);
//       }

//       imagesUrls.push(response?.data?.imageUrl[0]);
//     }
//     return imagesUrls;
//   };

//   const imageHandler = () => {
//     // create an input element
//     const input = document.createElement("input");
//     // set the type and accept attributes
//     input.setAttribute("type", "file");
//     input.setAttribute("accept", "image/*");
//     // trigger the click event
//     input.click();
//     // listen for the change event
//     input.onchange = async () => {
//       // get the editor instance from the ref
//       const editor = quillRef?.current?.getEditor();

//       // get the current cursor position
//       const range = editor?.getSelection();

//       // get the selected file
//       const files = input.files;
//       const preview = URL.createObjectURL(files[0]);
//       setUploadModalThumbs([preview]);

//       setUploadPrgsModalOpen(true);

//       // send the form data to the server or cloud service using an API
//       // for example, using axios
//       const response = await imageUpload(files);

//       let url = "";
//       if (response.length > 0) {
//         url = response[0];
//       }
//       console.log("imageUrl[0]", response);

//       // insert the image URL at the cursor position
//       editor.insertEmbed(range.index, "image", url);
//     };
//   };

//   const modules = useMemo(
//     () => ({
//       imageResize: {
//         parchment: Quill.import("parchment"),
//         modules: ["Resize", "DisplaySize"],
//       },
//       toolbar: {
//         container: [
//           // other toolbar options
//           ["bold", "italic", "underline", "strike"], // toggled buttons
//           ["blockquote", "code-block"],

//           [{ header: 1 }, { header: 2 }], // custom button values
//           [{ list: "ordered" }, { list: "bullet" }],
//           [{ script: "sub" }, { script: "super" }], // superscript/subscript
//           [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
//           [{ direction: "rtl" }], // text direction

//           [{ size: ["small", false, "large", "huge"] }], // custom dropdown
//           [{ header: [1, 2, 3, 4, 5, 6, false] }],

//           [{ color: [] }, { background: [] }], // dropdown with defaults from theme
//           [{ font: [] }],
//           [{ align: [] }],

//           ["clean"],
//           ["image"], // image button
//         ],
//         handlers: {
//           image: imageHandler, // custom handler function
//         },
//       },
//     }),
//     []
//   );

//   const handleAdd = (e) => {
//     const newVariant = {
//       size: size,
//       stock: stock,
//     };
//     setVariants((prev) => [...prev, newVariant]);
//     setVariantsLength(variantsLength + 1);
//   };

//   useEffect(() => {
//     console.log("variantsCHANGE", variants);
//   }, [variants]);

//   const onError = (e) => {
//     console.log("variants.lengthERROR", variants.length);

//     console.log("errors", errors);

//     if (variantsLength == 0) {
//       console.log("HAST", errors);

//       setError("variant", {
//         type: string,
//         message: "please select atleast one variant!",
//       });
//     } else {
//       clearErrors("variant");
//     }
//   };

//   const onSubmit = (data, event) => {
//     console.log("variants.length", variants.length);

//     if (variantsLength == 0) {
//       setError("variant", {
//         type: string,
//         message: "please select atleast one variant!",
//       });
//     } else {
//       clearErrors("variant");

//       const finalVariants = variants.filter((variant) => variant != undefined);
//       const formData = new FormData();
//       formData.append("title", title);
//       formData.append("variants", JSON.stringify(finalVariants));

//       formData.append("price", price);
//       formData.append("category", category);
//       formData.append("suspention", suspention);
//       formData.append("material", material);
//       formData.append("section", section);
//       formData.append("brand", brand);
//       formData.append("content", content);
//       formData.append("size", size);
//       formData.append("quantity", quantity);
//       if (allImages.length > 0) {
//         for (let i = 0; i < allImages.length; i++) {
//           formData.append("images", allImages[i]);
//         }
//       }

//       const object = Object.fromEntries(formData.entries());
//       console.log("UPPPPP", JSON.stringify(object));
//       dispatch(updateProduct(product._id, formData));
//     }
//   };

//   return (
//     <form className="relative" onSubmit={handleSubmit(onSubmit, onError)}>
//       <div
//         className={`${
//           uploadPrgsModalOpen ? "block" : "hidden"
//         } bg-gray-500/70 absolute h-full w-full z-40`}
//       >
//         <div className="relative flex h-[100vh] w-full justify-center items-center">
//           <div className="flex fixed justify-center">
//             {uploadModalThumbs?.map((thumb, index) => {
//               return (
//                 <div
//                   key={index}
//                   className="mx-0.5 max-md:w-[30vw] max-md:h-[30vw] w-[200px] h-[200px] bg-white rounded-xl relative z-50 flex justify-center items-center"
//                 >
//                   {console.log("Index", index)}

//                   <img
//                     className="absolute w-full h-full object-cover rounded-xl"
//                     src={thumb}
//                   />

//                   <div className="bg-slate-900/60 w-full h-full absolute rounded-xl"></div>
//                   {imgIndex == index && (
//                     <>
//                       <CircularProgress
//                         className="max-md:!w-[13vw] max-md:!h-[13vw] !w-[80px] !h-[80px]"
//                         variant="determinate"
//                         value={imgUploadPrc}
//                       />
//                       <span className="absolute max-md:text-[3vw] text-white">
//                         {imgUploadPrc}%
//                       </span>
//                       <span className="text-white max-md:text-[2vw] absolute bottom-5">
//                         image is uploading...
//                       </span>
//                     </>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//       <div className="px-6 pt-8 flex-grow w-full h-full max-h-full pb-40 md:pb-32 lg:pb-32 xl:pb-32">
//         <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
//           <label className="block text-sm text-gray-700 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium text-sm">
//             Product Title/Name
//           </label>
//           <div className="col-span-8 sm:col-span-4">
//             <input
//               defaultValue={title}
//               className="block w-full px-3 py-1 text-sm focus:outline-none dark:text-gray-300 leading-5 rounded-md focus:border-gray-200 border-gray-200 dark:border-gray-600 focus:ring focus:ring-green-300 dark:focus:border-gray-500 dark:focus:ring-gray-300 dark:bg-gray-700 border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
//               id="outlined-basic"
//               placeholder="Product Title/Name"
//               label="Product Name"
//               {...register("title", { required: true })}
//             />
//             {errors.title && (
//               <p className="text-red-600">title can't be empty</p>
//             )}
//           </div>
//         </div>

//         <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
//           <label className="block text-sm text-gray-700 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium text-sm">
//             Product Description
//           </label>
//           <div className="col-span-8 sm:col-span-4">
//             <ReactQuill
//               ref={quillRef}
//               modules={modules}
//               theme="snow"
//               value={content}
//               onChange={setContent}
//             />
//           </div>
//         </div>

//         <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
//           <label className="block text-sm text-gray-700 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium text-sm">
//             Product Images
//           </label>
//           <div className="col-span-8 sm:col-span-4">
//             <div className="w-full text-center">
//               <div className="grid gap-1 grid-cols-8">
//                 <div className="col-span-6 min-[470px]:col-span-2 md:col-span-2 ">
//                   <label
//                     for="file0"
//                     className="flex p-1.5 justify-center items-center border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md cursor-pointer"
//                   >
//                     {mainPreview?.length == "" ? (
//                       <>
//                         <span>main image here</span>
//                         {errors.mainimage && (
//                           <p className="text-red-600">
//                             you must upload main image
//                           </p>
//                         )}
//                       </>
//                     ) : (
//                       <img
//                         className="w-full h-32 object-cover"
//                         src={mainPreview}
//                       />
//                     )}
//                     <input
//                       {...register("mainimage", {
//                         onChange: async (e) => {
//                           console.log("changed", e.target.files[0]);
//                           const files = e.target.files;
//                           const preview = URL.createObjectURL(files[0]);
//                           setUploadModalThumbs([preview]);

//                           setUploadPrgsModalOpen(true);

//                           const response = await imageUpload(files);

//                           setMainImageUrl(response);
//                         },
//                       })}
//                       id="file0"
//                       tabIndex="-1"
//                       accept="image/*"
//                       type="file"
//                       autoComplete="off"
//                       style={{ display: "none" }}
//                     />
//                   </label>
//                 </div>
//                 <div className="col-span-6 min-[470px]:col-span-6 md:col-span-6">
//                   <label
//                     for="file1"
//                     className="flex  justify-center items-center   border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md cursor-pointer p-1.5"
//                   >
//                     <input
//                       {...register("otherImages", {
//                         onChange: async (e) => {
//                           const files = e.target.files;

//                           let imagess = [];
//                           for (let i = 0; i < files.length; i++) {
//                             imagess.push(URL.createObjectURL(files[i]));
//                           }
//                           console.log("otherImagesD", imagess);
//                           setUploadModalThumbs(imagess);
//                           if (files.length < 4) {
//                             setUploadPrgsModalOpen(true);
//                             const response = await imageUpload(files);

//                             setOtherImagesUrl(response);
//                           }
//                         },
//                       })}
//                       id="file1"
//                       tabIndex="-1"
//                       accept="image/*"
//                       multiple
//                       type="file"
//                       autoComplete="off"
//                       style={{ display: "none" }}
//                     />
//                     {othersPreview?.length == 0 ? (
//                       <>
//                         <span>other images here</span>
//                         {errors.otherImages && (
//                           <p className="text-red-600">
//                             you must upload at least one image
//                           </p>
//                         )}
//                       </>
//                     ) : othersPreview?.length > 3 ? (
//                       <span className="text-red-600">
//                         maximum number of images must be 3
//                       </span>
//                     ) : (
//                       <div className="grid gap-1.5 grid-cols-3 xl:grid-cols-3">
//                         {othersPreview?.map((image, i) => {
//                           while (i < othersPreview.length) {
//                             return (
//                               <img
//                                 className=" h-32 object-cover"
//                                 key={i}
//                                 src={image}
//                               />
//                             );
//                           }
//                         })}
//                       </div>
//                     )}
//                   </label>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
//           <label className="block text-sm text-gray-700 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium text-sm">
//             Category
//           </label>
//           <div className="col-span-8 sm:col-span-4">
//             <select
//               onChange={(e) => setCategory(e.target.value)}
//               className="block w-full px-2 py-1 text-sm dark:text-gray-300 focus:outline-none rounded-md form-select focus:border-gray-200 border-gray-200 dark:border-gray-600 focus:shadow-none focus:ring focus:ring-green-300 dark:focus:border-gray-500 dark:focus:ring-gray-300 dark:bg-gray-700 leading-5 border h-12 text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
//             >
//               {categories?.map((cat) => {
//                 return (
//                   <option
//                     selected={cat._id == product?.category}
//                     value={cat._id}
//                   >
//                     {cat.name}
//                   </option>
//                 );
//               })}
//             </select>
//           </div>
//         </div>

//         <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
//           <label className="block text-sm text-gray-700 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium text-sm">
//             Section
//           </label>
//           <div className="col-span-8 sm:col-span-4">
//             <select
//               def
//               onChange={(e) =>
//                 setSection(e.target.options[e.target.selectedIndex].value)
//               }
//               className="block w-full px-2 py-1 text-sm dark:text-gray-300 focus:outline-none rounded-md form-select focus:border-gray-200 border-gray-200 dark:border-gray-600 focus:shadow-none focus:ring focus:ring-green-300 dark:focus:border-gray-500 dark:focus:ring-gray-300 dark:bg-gray-700 leading-5 border h-12 text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
//             >
//               <option
//                 disabled={bestSeller?.length >= 6}
//                 selected={product?.section === SECTIONS.Best_Seller}
//                 value={SECTIONS.Best_Seller}
//               >
//                 {SECTIONS.Best_Seller}
//               </option>
//               ;
//               <option
//                 disabled={hotDiscount?.length >= 4}
//                 selected={product?.section === SECTIONS.Hot_Discount}
//                 value={SECTIONS.Hot_Discount}
//               >
//                 {SECTIONS.Hot_Discount}
//               </option>
//               ;
//               <option
//                 selected={product?.section === SECTIONS.New_Arrival}
//                 value={SECTIONS.New_Arrival}
//               >
//                 {SECTIONS.New_Arrival}
//               </option>
//               ;
//               <option
//                 disabled={ourOffer?.length >= 4}
//                 selected={product?.section === SECTIONS.Our_Offer}
//                 value={SECTIONS.Our_Offer}
//               >
//                 {SECTIONS.Our_Offer}
//               </option>
//             </select>
//           </div>
//         </div>

//         <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
//           <label className="block text-sm text-gray-700 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium text-sm">
//             Suspention
//           </label>
//           <div className="col-span-8 sm:col-span-4">
//             <select
//               onChange={(e) =>
//                 setSuspention(e.target.options[e.target.selectedIndex].text)
//               }
//               className="block w-full px-2 py-1 text-sm dark:text-gray-300 focus:outline-none rounded-md form-select focus:border-gray-200 border-gray-200 dark:border-gray-600 focus:shadow-none focus:ring focus:ring-green-300 dark:focus:border-gray-500 dark:focus:ring-gray-300 dark:bg-gray-700 leading-5 border h-12 text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
//             >
//               <option selected={product?.suspention === "Dual Suspension"}>
//                 Dual Suspension
//               </option>

//               <option selected={product?.suspention === "Hardtail"}>
//                 Hardtail
//               </option>
//               <option selected={product?.suspention === "Rigid"}>Rigid</option>
//             </select>
//           </div>
//         </div>

//         <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
//           <label className="block text-sm text-gray-700 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium text-sm">
//             Material
//           </label>
//           <div className="col-span-8 sm:col-span-4">
//             <select
//               onChange={(e) =>
//                 setMaterial(e.target.options[e.target.selectedIndex].text)
//               }
//               className="block w-full px-2 py-1 text-sm dark:text-gray-300 focus:outline-none rounded-md form-select focus:border-gray-200 border-gray-200 dark:border-gray-600 focus:shadow-none focus:ring focus:ring-green-300 dark:focus:border-gray-500 dark:focus:ring-gray-300 dark:bg-gray-700 leading-5 border h-12 text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
//             >
//               <option selected={product?.material === "Carbon"}>Carbon</option>;
//               <option selected={product?.material === "Aluminium"}>
//                 Aluminium
//               </option>
//               ;<option selected={product?.material === "Other"}>Other</option>;
//             </select>
//           </div>
//         </div>

//         <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
//           <label className="block text-sm text-gray-700 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium text-sm">
//             Brand
//           </label>
//           <div className="col-span-8 sm:col-span-4">
//             <select
//               onChange={(e) =>
//                 setBrand(e.target.options[e.target.selectedIndex].text)
//               }
//               className="block w-full px-2 py-1 text-sm dark:text-gray-300 focus:outline-none rounded-md form-select focus:border-gray-200 border-gray-200 dark:border-gray-600 focus:shadow-none focus:ring focus:ring-green-300 dark:focus:border-gray-500 dark:focus:ring-gray-300 dark:bg-gray-700 leading-5 border h-12 text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
//             >
//               <option selected={product?.brand === "BIANCHI"}>BIANCHI</option>;
//               <option selected={product?.brand === "CIPOLLINI"}>
//                 CIPOLLINI
//               </option>
//               ;<option selected={product?.brand === "FUJI"}>FUJI</option>
//               <option selected={product?.brand === "GT"}>GT</option>
//               <option selected={product?.brand === "KTM"}>KTM</option>
//               <option selected={product?.brand === "SCOTT"}>SCOTT</option>
//               <option selected={product?.brand === "CUBE"}>CUBE</option>
//               <option selected={product?.brand === "Cannondale"}>
//                 Cannondale
//               </option>
//               <option selected={product?.brand === "Cannondale"}>BMC</option>
//             </select>
//           </div>
//         </div>

//         <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
//           <label className="block text-sm text-gray-700 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium text-sm">
//             Product Price
//           </label>
//           <div className="col-span-8 sm:col-span-4">
//             <div className="flex flex-row">
//               <span className="inline-flex items-center px-3 rounded rounded-r-none border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm focus:bg-white focus:border-green-300 dark:bg-gray-700 dark:text-gray-300 dark:border dark:border-gray-600">
//                 $
//               </span>
//               <input
//                 defaultValue={price}
//                 {...register("price", { required: true })}
//                 type="number"
//                 className="block w-full px-3 py-1 text-sm focus:outline-none dark:text-gray-300 leading-5 rounded-md focus:border-gray-200 border-gray-200 dark:border-gray-600 focus:ring focus:ring-green-300 dark:focus:border-gray-500 dark:focus:ring-gray-300 dark:bg-gray-700 bg-gray-50 mr-2 rounded w-full h-12 p-2 text-sm border border-gray-300 focus:bg-white focus:border-gray-300 focus:outline-none rounded-l-none"
//               ></input>
//             </div>
//             {errors.price && (
//               <p className="text-red-600">price can't be empty</p>
//             )}
//           </div>
//         </div>

//         <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6 relative">
//           <label className="block text-sm text-gray-700 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium text-sm">
//             Product Quantity
//           </label>
//           <div className="col-span-8 sm:col-span-4">
//             <div className="flex flex-row">
//               <input
//                 defaultValue={quantity}
//                 onChange={(e) => setQuantity(e.target.value)}
//                 type="number"
//                 className="block w-full px-3 py-1 text-sm focus:outline-none dark:text-gray-300 leading-5 rounded-md focus:border-gray-200 border-gray-200 dark:border-gray-600 focus:ring focus:ring-green-300 dark:focus:border-gray-500 dark:focus:ring-gray-300 dark:bg-gray-700 bg-gray-50 mr-2 rounded  w-full h-12 p-2 text-sm border border-gray-300 focus:bg-white focus:border-gray-300 focus:outline-none"
//               ></input>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6 relative">
//           <label className="block text-sm text-gray-700 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium text-sm">
//             Product Variants
//           </label>
//           <div className="col-span-8 sm:col-span-4">
//             <div className="grid justify-items-center grid-cols-1 min-[400px]:grid-cols-2 min-[860px]:grid-cols-3">
//               {variants?.map(
//                 (variant, index) =>
//                   variants[index] && (
//                     <div
//                       key={index}
//                       className="block mr-4 mb-4 flex-row w-40 h-[215px] border border-green-400 shadow-md bg-green-200 rounded"
//                     >
//                       <div className="flex mt-4 items-center h-fit px-1.5">
//                         <span className="mr-1">quantity:</span>
//                         <input
//                           disabled={index < variants.length}
//                           value={variant.stock}
//                           defaultValue={variant.stock}
//                           type="number"
//                           className="block w-full px-3 py-1 text-sm focus:outline-none dark:text-gray-300 leading-5 rounded-md  border-gray-200 dark:border-gray-600 dark:focus:border-gray-500 dark:focus:ring-gray-300 dark:bg-gray-700 bg-gray-50 mr-2 rounded  w-full h-8 p-2 text-sm border border-gray-300 focus:bg-white  focus:outline-none"
//                         ></input>
//                       </div>

//                       <div className="flex mt-4 items-center h-fit px-1.5">
//                         <span className="mr-1">size:</span>
//                         <select
//                           disabled={index < variants.length}
//                           className="block w-full px-2 py-1 text-sm dark:text-gray-300 focus:outline-none rounded-md form-select border-gray-200 dark:border-gray-600 focus:shadow-none dark:focus:border-gray-500 dark:focus:ring-gray-300 dark:bg-gray-700 leading-5 border h-8 text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
//                         >
//                           <option
//                             selected={variant.size == "48cm"}
//                             value={"48cm"}
//                           >
//                             48cm
//                           </option>
//                           <option
//                             selected={variant.size == "54cm"}
//                             value={"54cm"}
//                           >
//                             54cm
//                           </option>
//                           ;
//                           <option
//                             selected={variant.size == "58cm"}
//                             value={"58cm"}
//                           >
//                             58cm
//                           </option>
//                           ;
//                           <option
//                             selected={variant.size == "62cm"}
//                             value={"62cm"}
//                           >
//                             62cm
//                           </option>
//                         </select>
//                       </div>
//                       <div className="flex mt-4 justify-center items-center h-fit px-1.5">
//                         <button
//                           type="button"
//                           onClick={(e) => {
//                             //variants.splice(index, 1);

//                             delete variants[index];
//                             const newArr = [...variants];
//                             setVariants(newArr);
//                             setVariantsLength(variantsLength - 1);
//                           }}
//                           className="px-10 py-2 rounded bg-blue-500"
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     </div>
//                   )
//               )}

//               <div className="block mr-4 mb-4 flex-row w-40 h-[215px] border-[3px] border-dashed border-gray-200 rounded">
//                 <div className="flex mt-4 items-center h-fit px-1.5">
//                   <span className="mr-1">stock:</span>
//                   <input
//                     defaultValue={stock}
//                     {...register("stock", { required: true })}
//                     type="number"
//                     className="block w-full px-3 py-1 text-sm focus:outline-none dark:text-gray-300 leading-5 rounded-md  border-gray-200 dark:border-gray-600 dark:focus:border-gray-500 dark:focus:ring-gray-300 dark:bg-gray-700 bg-gray-50 mr-2 rounded  w-full h-8 p-2 text-sm border border-gray-300 focus:bg-white  focus:outline-none"
//                   ></input>
//                 </div>

//                 <div className="flex mt-4 items-center h-fit px-1.5">
//                   <span className="mr-1">size:</span>
//                   <select
//                     {...register("size", { required: true })}
//                     className="block w-full px-2 py-1 text-sm dark:text-gray-300 focus:outline-none rounded-md form-select border-gray-200 dark:border-gray-600 focus:shadow-none dark:focus:border-gray-500 dark:focus:ring-gray-300 dark:bg-gray-700 leading-5 border h-8 text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
//                   >
//                     <option value={"48cm"}>48cm</option>
//                     <option value={"54cm"}>54cm</option>;
//                     <option value={"58cm"}>58cm</option>;
//                     <option value={"62cm"}>62cm</option>
//                   </select>
//                 </div>
//                 <div className="flex mt-4 justify-center items-center h-fit px-1.5">
//                   <button
//                     type="button"
//                     onClick={(e) => handleAdd(e)}
//                     className="px-10 py-2 rounded bg-blue-500"
//                   >
//                     Add
//                   </button>
//                 </div>
//                 {errors.variant && variantsLength == 0 && (
//                   <p className="text-red-600">
//                     you must choose at least one variant
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         <Grid item xs={12}></Grid>
//         <Grid item xs={12}>
//           <button
//             className="bg-blue-500 rounded-xl p-3 w-[130px]"
//             type="submit"
//           >
//             {loading ? (
//               <div className="flex justify-center">
//                 <LoadingIndicator />
//               </div>
//             ) : (
//               <span>edite product</span>
//             )}
//           </button>
//         </Grid>
//       </div>
//     </form>
//   );
// }

// export default EditeProduct;
