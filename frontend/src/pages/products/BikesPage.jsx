// import React from "react";
// import { useEffect, useState } from "react";
// import ProductCard from "../../components/ProductCard/ProductCard";
// import { useSelector, useDispatch } from "react-redux";
// import { getProductsByFilter } from "../../actions/products";
// import Slider from "@mui/material/Slider";
// import FormGroup from "@mui/material/FormGroup";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import Checkbox from "@mui/material/Checkbox";
// import FilterAltIcon from "@mui/icons-material/FilterAlt";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import Accordion from "@mui/material/Accordion";
// import AccordionSummary from "@mui/material/AccordionSummary";
// import AccordionDetails from "@mui/material/AccordionDetails";
// import Typography from "@mui/material/Typography";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import "./BikesPage.css";
// import Pagination from "../../components/Pagination/Pagination";
// import { fetchCategories } from "../../actions/categories";
// import CardSkeleton from "../../components/ProductCard/CardSkeleton";
// import SearchOffIcon from "@mui/icons-material/SearchOff";
// import { useIsMount } from "../../hooks/useIsMount";

// function BikesPage() {
//   const dispatch = useDispatch();

//   const [priceRange, setPriceRange] = React.useState([2000, 5700]);
//   const [selectedCategories, setSelectedCategories] = useState([]);
//   const [selectedSuspentions, setSelectedSuspentions] = useState([]);
//   const [selectedMaterials, setSelectedMaterials] = useState([]);
//   const [selectedBrands, setSelectedBrands] = useState([]);
//   const [selectedSizes, setSelectedSizes] = useState([]);
//   const [filters, setFilters] = useState({});

//   const isMount = useIsMount();

//   const allCategories = useSelector((state) => state.categories);
//   const { categories } = allCategories;

//   const handlePriceChange = (event, newValue) => {
//     console.log("range", newValue);
//     setPriceRange(newValue);
//     setFilters({ ...filters, priceMin: newValue[0], priceMax: newValue[1] });
//   };

//   const handleCategoryChange = (e) => {
//     const isChecked = e.target.checked;
//     if (isChecked) {
//       setSelectedCategories([...selectedCategories, e.target.value]);
//     } else if (!isChecked) {
//       setSelectedCategories(
//         selectedCategories.filter((category) => category !== e.target.value)
//       );
//     }
//   };

//   const handleSuspentionChange = (e) => {
//     const isChecked = e.target.checked;
//     if (isChecked) {
//       setSelectedSuspentions([...selectedSuspentions, e.target.value]);
//     } else if (!isChecked) {
//       setSelectedSuspentions(
//         selectedSuspentions.filter(
//           (suspention) => suspention !== e.target.value
//         )
//       );
//     }
//   };

//   const handleMaterialChange = (e) => {
//     const isChecked = e.target.checked;
//     if (isChecked) {
//       setSelectedMaterials([...selectedMaterials, e.target.value]);
//     } else if (!isChecked) {
//       setSelectedMaterials(
//         selectedMaterials.filter((material) => material !== e.target.value)
//       );
//     }
//   };

//   const handleBrandChange = (e) => {
//     const isChecked = e.target.checked;
//     if (isChecked) {
//       setSelectedBrands([...selectedBrands, e.target.value]);
//     } else if (!isChecked) {
//       setSelectedBrands(
//         selectedBrands.filter((brand) => brand !== e.target.value)
//       );
//     }
//   };

//   const handleSizeChange = (e) => {
//     const isChecked = e.target.checked;
//     if (isChecked) {
//       setSelectedSizes([...selectedSizes, e.target.value]);
//     } else if (!isChecked) {
//       setSelectedSizes(selectedSizes.filter((size) => size !== e.target.value));
//     }
//   };

//   useEffect(() => {
//     if (selectedCategories.length !== 0) {
//       console.log("selectedCats", selectedCategories);
//       setFilters({ ...filters, categories: selectedCategories });
//     } else {
//       console.log("selectedCategories", selectedCategories);
//       delete filters.categories;
//       setFilters({ ...filters });
//     }
//   }, [selectedCategories]);

//   useEffect(() => {
//     if (selectedSuspentions.length !== 0) {
//       console.log("selectedSuspentions", selectedSuspentions);
//       setFilters({ ...filters, suspentions: selectedSuspentions });
//     } else {
//       console.log("selectedSuspentions", selectedSuspentions);
//       delete filters.suspentions;
//       setFilters({ ...filters });
//     }
//   }, [selectedSuspentions]);

//   useEffect(() => {
//     if (selectedMaterials.length !== 0) {
//       console.log("selectedMaterials", selectedMaterials);
//       setFilters({ ...filters, materials: selectedMaterials });
//     } else {
//       console.log("selectedMaterials", selectedMaterials);
//       delete filters.materials;
//       setFilters({ ...filters });
//     }
//   }, [selectedMaterials]);

//   useEffect(() => {
//     if (selectedBrands.length !== 0) {
//       console.log("selectedBrands", selectedBrands);
//       setFilters({ ...filters, brands: selectedBrands });
//     } else {
//       console.log("selectedBrands", selectedBrands);
//       delete filters.brands;
//       setFilters({ ...filters });
//     }
//   }, [selectedBrands]);

//   useEffect(() => {
//     if (selectedSizes.length !== 0) {
//       console.log("selectedSizes", selectedSizes);
//       setFilters({ ...filters, sizes: selectedSizes });
//     } else {
//       console.log("selectedSizes", selectedSizes);
//       delete filters.sizes;
//       setFilters({ ...filters });
//     }
//   }, [selectedSizes]);

//   useEffect(() => {
//     console.log("filters", filters);
//     setPage(1);
//     dispatch(getProductsByFilter(filters, {}, 1));
//   }, [filters]);

//   const product = useSelector((state) => state.products);
//   const { loading, products, totalPages, pageSize, totalProducts } = product;

//   const pageNumber = 1;

//   const [filterStyle, setFilterStyle] = useState();
//   const [filterOpen, setFilterOpen] = useState();
//   const [page, setPage] = useState(pageNumber);
//   const [pages, setPages] = useState();

//   useEffect(() => {
//     dispatch(getProductsByFilter(filters, {}, page));

//     window.scrollTo({ top: 120, left: 0, behavior: "smooth" });
//   }, [dispatch, page]);

//   useEffect(() => {
//     setPages(totalPages);
//   }, [totalPages]);

//   useEffect(() => {
//     dispatch(fetchCategories());
//   }, [dispatch]);

//   const filterToggleHandler = () => {
//     setFilterOpen(!filterOpen);
//   };

//   return (
//     <div className="grid md:grid-cols-3 lg:grid-cols-4">
//       <div
//         className={`filter-products relative w-60 ${
//           filterOpen ? "filter-open" : "filter-close"
//         } `}
//       >
//         <div onClick={filterToggleHandler} className="back-button lg:hidden">
//           <ArrowBackIcon />
//           BACK
//         </div>
//         <Accordion>
//           <AccordionSummary
//             expandIcon={<ExpandMoreIcon />}
//             aria-controls="panel1a-content"
//             id="panel1a-header"
//           >
//             <Typography>Price Range</Typography>
//           </AccordionSummary>
//           <AccordionDetails>
//             <Slider
//               min={0}
//               max={9500}
//               value={priceRange}
//               onChange={handlePriceChange}
//               aria-label="Default"
//               valueLabelDisplay="auto"
//             />
//             <div className="priceRange-inputs">
//               <input
//                 value={priceRange[0]}
//                 type="text"
//                 onChange={(e) => setPriceRange([e.target.value, priceRange[1]])}
//               />
//               <input
//                 value={priceRange[1]}
//                 type="text"
//                 onChange={(e) => setPriceRange([priceRange[0], e.target.value])}
//               />
//             </div>
//           </AccordionDetails>
//         </Accordion>
//         <Accordion>
//           <AccordionSummary
//             expandIcon={<ExpandMoreIcon />}
//             aria-controls="panel2a-content"
//             id="panel2a-header"
//           >
//             <Typography>Categories</Typography>
//           </AccordionSummary>
//           <AccordionDetails>
//             <FormGroup>
//               {categories?.map((category, index) => {
//                 return (
//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         id={category.id}
//                         value={category.name}
//                         onChange={(e) => handleCategoryChange(e)}
//                       />
//                     }
//                     label={category.name}
//                   />
//                 );
//               })}
//             </FormGroup>
//           </AccordionDetails>
//         </Accordion>
//         <Accordion>
//           <AccordionSummary
//             expandIcon={<ExpandMoreIcon />}
//             aria-controls="panel2a-content"
//             id="panel2a-header"
//           >
//             <Typography>Suspension</Typography>
//           </AccordionSummary>
//           <AccordionDetails>
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   onChange={(e) => handleSuspentionChange(e)}
//                   value="Dual Suspension"
//                 />
//               }
//               label="Dual Suspension"
//             />
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   onChange={(e) => handleSuspentionChange(e)}
//                   value="Hardtail"
//                 />
//               }
//               label="Hardtail"
//             />
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   onChange={(e) => handleSuspentionChange(e)}
//                   value="Rigid"
//                 />
//               }
//               label="Rigid"
//             />
//           </AccordionDetails>
//         </Accordion>
//         <Accordion>
//           <AccordionSummary
//             expandIcon={<ExpandMoreIcon />}
//             aria-controls="panel2a-content"
//             id="panel2a-header"
//           >
//             <Typography>Material</Typography>
//           </AccordionSummary>
//           <AccordionDetails>
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   onChange={(e) => handleMaterialChange(e)}
//                   value="Carbon"
//                 />
//               }
//               label="Carbon"
//             />
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   onChange={(e) => handleMaterialChange(e)}
//                   value="Aluminium"
//                 />
//               }
//               label="Aluminium"
//             />
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   onChange={(e) => handleMaterialChange(e)}
//                   value="Other"
//                 />
//               }
//               label="Other"
//             />
//           </AccordionDetails>
//         </Accordion>
//         <Accordion>
//           <AccordionSummary
//             expandIcon={<ExpandMoreIcon />}
//             aria-controls="panel2a-content"
//             id="panel2a-header"
//           >
//             <Typography>Brands</Typography>
//           </AccordionSummary>
//           <AccordionDetails>
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   onChange={(e) => handleBrandChange(e)}
//                   value="BIANCHI"
//                 />
//               }
//               label="BIANCHI"
//             />
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   onChange={(e) => handleBrandChange(e)}
//                   value="CIPOLLINI"
//                 />
//               }
//               label="CIPOLLINI"
//             />
//             <FormControlLabel
//               control={
//                 <Checkbox onChange={(e) => handleBrandChange(e)} value="FUJI" />
//               }
//               label="FUJI"
//             />
//             <FormControlLabel
//               control={
//                 <Checkbox onChange={(e) => handleBrandChange(e)} value="GT" />
//               }
//               label="GT"
//             />
//             <FormControlLabel
//               control={
//                 <Checkbox onChange={(e) => handleBrandChange(e)} value="KTM" />
//               }
//               label="KTM"
//             />
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   onChange={(e) => handleBrandChange(e)}
//                   value="SCOTT"
//                 />
//               }
//               label="SCOTT"
//             />
//             <FormControlLabel
//               control={
//                 <Checkbox onChange={(e) => handleBrandChange(e)} value="CUBE" />
//               }
//               label="CUBE"
//             />
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   onChange={(e) => handleBrandChange(e)}
//                   value="Cannondale"
//                 />
//               }
//               label="Cannondale"
//             />
//             <FormControlLabel
//               control={
//                 <Checkbox onChange={(e) => handleBrandChange(e)} value="BMC" />
//               }
//               label="BMC"
//             />
//           </AccordionDetails>
//         </Accordion>
//         <Accordion>
//           <AccordionSummary
//             expandIcon={<ExpandMoreIcon />}
//             aria-controls="panel2a-content"
//             id="panel2a-header"
//           >
//             <Typography>Size</Typography>
//           </AccordionSummary>
//           <AccordionDetails>
//             <FormControlLabel
//               control={
//                 <Checkbox onChange={(e) => handleSizeChange(e)} value="28C" />
//               }
//               label="28C"
//             />
//             <FormControlLabel
//               control={
//                 <Checkbox onChange={(e) => handleSizeChange(e)} value="25C" />
//               }
//               label="25C"
//             />
//             <FormControlLabel
//               control={
//                 <Checkbox onChange={(e) => handleSizeChange(e)} value="30C" />
//               }
//               label="30C"
//             />
//             <FormControlLabel
//               control={
//                 <Checkbox onChange={(e) => handleSizeChange(e)} value="32C" />
//               }
//               label="32C"
//             />
//             <FormControlLabel
//               control={
//                 <Checkbox onChange={(e) => handleSizeChange(e)} value="35C" />
//               }
//               label="35C"
//             />
//           </AccordionDetails>
//         </Accordion>
//       </div>
//       <div className="col-span-3">
//         <div className="list-topBar lg:hidden">
//           <div onClick={filterToggleHandler} className="filter-button">
//             <FilterAltIcon />
//             <span>Filter</span>
//           </div>
//         </div>
//         {products.length == 0 && !loading && !isMount && (
//           <div className="text-[40pt] mt-[130px]">
//             <p className="text-center">NO PRODUCT FOUND!</p>
//             <p className="text-center text-[50pt]">
//               <SearchOffIcon fontSize="inherit" />
//             </p>
//           </div>
//         )}
//         <div className="grid grid-cols-2 md:grid-cols-3 BikesPage">
//           {loading ? (
//             <>
//               <CardSkeleton imgClass="w-[160px] md:w-[260px] h-[110px] md:h-[190px]" />
//               <CardSkeleton imgClass="w-[160px] md:w-[260px] h-[110px] md:h-[190px]" />

//               <CardSkeleton imgClass="w-[160px] md:w-[260px] h-[110px] md:h-[190px]" />
//               <CardSkeleton imgClass="w-[160px] md:w-[260px] h-[110px] md:h-[190px]" />
//             </>
//           ) : (
//             products.map((p) => {
//               return (
//                 <ProductCard
//                   key={p._id}
//                   price={p.price}
//                   title={p.title}
//                   image={p.images[0]}
//                   slug={p.slug}
//                   rating={p.rating}
//                 />
//               );
//             })
//           )}
//         </div>

//         <Pagination
//           totalItems={totalProducts}
//           pageSize={pageSize}
//           page={page}
//           pages={pages}
//           changePage={setPage}
//         />
//       </div>
//     </div>
//   );
// }

// export default BikesPage;
