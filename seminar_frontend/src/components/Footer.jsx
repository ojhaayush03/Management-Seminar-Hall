import React from "react";

// const Footer = () => {
//     return (
//     <footer className="bg-gray-800 text-white text-center py-4">
//         <p>&copy; 2024 Seminar Hall Management. All rights reserved.</p>
//     </footer>
//     );
// };

// export default Footer;

const Footer = () => {
    return (
      <footer className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">&copy; 2024 Seminar Hall Management. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-sm hover:underline">
                Privacy Policy
              </a>
              <a href="#" className="text-sm hover:underline">
                Terms of Service
              </a>
              <a href="#" className="text-sm hover:underline">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    )
  }
  
  export default Footer
  
  