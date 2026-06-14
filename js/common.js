// ========== COMMON FUNCTIONS & DATA ==========
// This file is loaded on ALL pages

// Email validation function
function validateEmail(email) {
    return /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(email);
}

// Default product data
const defaultProducts = [
    { id: 1, name: "White Rice (1kg)", category: "Grains", naivas: 180, carrefour: 165, quickmart: 175 },
    { id: 2, name: "Cooking Oil (1L)", category: "Cooking", naivas: 320, carrefour: 299, quickmart: 310 },
    { id: 3, name: "Wheat Flour (1kg)", category: "Grains", naivas: 130, carrefour: 120, quickmart: 125 },
    { id: 4, name: "Sugar (1kg)", category: "Pantry", naivas: 195, carrefour: 185, quickmart: 190 },
    { id: 5, name: "Milk (500ml)", category: "Dairy", naivas: 55, carrefour: 52, quickmart: 54 },
    { id: 6, name: "Tomato Paste (70g)", category: "Canned", naivas: 45, carrefour: 40, quickmart: 42 },
    { id: 7, name: "Bread (400g)", category: "Bakery", naivas: 60, carrefour: 55, quickmart: 58 },
    { id: 8, name: "Eggs (1 tray)", category: "Dairy", naivas: 420, carrefour: 395, quickmart: 410 },
    { id: 9, name: "Tea Leaves (250g)", category: "Beverages", naivas: 250, carrefour: 235, quickmart: 245 },
    { id: 10, name: "Salt (500g)", category: "Pantry", naivas: 25, carrefour: 20, quickmart: 22 }
];

// Initialize products in localStorage if not exists
if (!localStorage.getItem('products')) {
    localStorage.setItem('products', JSON.stringify(defaultProducts));
}