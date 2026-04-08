import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    // Define allowed mimetypes
    const allowedTypes = [
        "image/jpeg", 
        "image/png", 
        "image/jpg", 
        "application/pdf" // Added PDF support
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        // This is the error message that was triggering on your frontend
        cb(new Error("Invalid file type. Only JPEG, PNG, and PDF are allowed!"), false);
    }
};

// Use the storage and the fileFilter together
export const singleUpload = multer({ 
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Optional: 5MB limit
}).single("file");

export default singleUpload;