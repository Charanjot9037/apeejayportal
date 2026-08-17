// "use client";

// import React, { useState } from "react";

// const ProjectGallery = ({ images = [] }) => {
//   const [activeImage, setActiveImage] = useState(images[0]);

//   return (
//     <section className="space-y-3">
//       {/* Main image */}
//       <div className="group overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
//         <img
//           src={activeImage}
//           alt="Project preview"
//           className="h-56 w-full object-cover transition duration-500 group-hover:scale-[1.02] sm:h-72 lg:h-80"
//         />
//       </div>

//       {/* Thumbnails */}
//       <div className="grid grid-cols-4 gap-2 sm:gap-3">
//         {images.map((image, index) => {
//           const isActive = image === activeImage;

//           return (
//             <button
//               key={image + index}
//               type="button"
//               onClick={() => setActiveImage(image)}
//               className={`group overflow-hidden rounded-lg border transition duration-300 ${
//                 isActive
//                   ? "border-orange-500 ring-2 ring-orange-100"
//                   : "border-gray-200 hover:border-orange-300"
//               }`}
//             >
//               <img
//                 src={image}
//                 alt={`Project preview ${index + 1}`}
//                 className="h-16 w-full object-cover transition duration-300 group-hover:scale-105 sm:h-20"
//               />
//             </button>
//           );
//         })}
//       </div>
//     </section>
//   );
// };

// export default ProjectGallery;