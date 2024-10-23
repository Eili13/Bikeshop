const mongoose = require('mongoose');

// SUB CATEGORY SCHEMA
const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter subcategory name'],
        trim: true,
        maxLength: [100, 'Subcategory name cannot exceed 100 characters']
    }
});

// MAIN CATEGORY SCHEMA
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    subcategories: [subCategorySchema] // Embed subCategorySchema here
}, {
    timestamps: true
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;