<?php
// index.php - API root endpoint

require_once __DIR__ . '/config.php';

sendResponse([
    'name' => APP_NAME,
    'version' => '1.0.0',
    'status' => 'running',
    'endpoints' => [
        'auth' => [
            'POST /api/login' => 'Login user',
            'POST /api/register' => 'Register new user',
            'POST /api/forgot_password' => 'Request password reset',
            'POST /api/reset_password' => 'Reset password with code'
        ],
        'products' => [
            'GET /api/get_products' => 'Get all products',
            'GET /api/get_product?id={id}' => 'Get single product',
            'POST /api/add_product' => 'Add product (admin)',
            'PUT /api/update_product' => 'Update product (admin)',
            'DELETE /api/delete_product?id={id}' => 'Delete product (admin)',
            'POST /api/update_price' => 'Update product price (admin)',
            'POST /api/bulk_update' => 'Bulk update prices (admin)'
        ],
        'baskets' => [
            'POST /api/save_basket' => 'Save shopping basket',
            'GET /api/get_baskets' => 'Get user baskets',
            'GET /api/load_basket?id={id}' => 'Load specific basket',
            'DELETE /api/delete_basket?id={id}' => 'Delete basket'
        ],
        'users' => [
            'GET /api/get_users' => 'Get all users (admin)',
            'DELETE /api/delete_user?id={id}' => 'Delete user (admin)',
            'GET /api/get_stats' => 'Get dashboard stats (admin)',
            'POST /api/sync_users' => 'Sync users from frontend'
        ]
    ]
]);
?>