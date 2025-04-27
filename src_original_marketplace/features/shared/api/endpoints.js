export const ENDPOINTS = {
    // Properties
    CREATE_PROPERTY: '/api/properties',
    GET_PROPERTIES: '/api/properties',
    GET_PROPERTY: (propertyId) => `/api/properties/${propertyId}`,
    UPDATE_PROPERTY: (propertyId) => `/api/properties/${propertyId}`,
    DELETE_PROPERTY: (propertyId) => `/api/properties/${propertyId}`,
    GET_PROPERTY_DETAILS: (propertyId) => `/api/properties/${propertyId}/details`,
    CREATE_PROPERTY_WHOLE: '/api/properties/whole',

    // Companies
    GET_COMPANIES_BY_TYPE: (companyType) => `/api/companies/by-type/${companyType}`,

    // Rooms
    CREATE_ROOM: '/api/rooms',
    GET_ROOMS: '/api/rooms',
    GET_ROOM: (roomId) => `/api/rooms/${roomId}`,
    UPDATE_ROOM: (roomId) => `/api/rooms/${roomId}`,
    DELETE_ROOM: (roomId) => `/api/rooms/${roomId}`,
    GET_ROOM_DETAILS: (roomId) => `/api/rooms/${roomId}/details`,

    // Products
    CREATE_PRODUCT: '/api/products',
    GET_PRODUCTS: '/api/products',
    GET_PRODUCT: (productId) => `/api/products/${productId}`,
    UPDATE_PRODUCT: (productId) => `/api/products/${productId}`,
    DELETE_PRODUCT: (productId) => `/api/products/${productId}`,
    GET_PRODUCT_DETAILS: (productId) => `/api/products/${productId}/details`,
    GET_PRODUCTS_BY_PROPERTY: (propertyId) => `/api/products/property/${propertyId}`,
    
    // Product Specifications
    CREATE_PRODUCT_SPECIFICATION: (productId) => `/api/products/${productId}/specifications`,
    UPDATE_PRODUCT_SPECIFICATIONS: (productId) => `/api/products/${productId}/specifications`,
    GET_PRODUCT_SPECIFICATIONS: (productId) => `/api/products/${productId}/specifications`,
    DELETE_PRODUCT_SPECIFICATION: (specId) => `/api/specifications/${specId}`,
    GET_PRODUCT_SPECIFICATION: (specId) => `/api/specifications/${specId}`,

    // Product Dimensions
    CREATE_PRODUCT_DIMENSION: (productId) => `/api/products/${productId}/dimensions`,
    UPDATE_PRODUCT_DIMENSIONS: (productId) => `/api/products/${productId}/dimensions`,
    GET_PRODUCT_DIMENSIONS: (productId) => `/api/products/${productId}/dimensions`,
    DELETE_PRODUCT_DIMENSION: (dimensionId) => `/api/dimensions/${dimensionId}`,
    GET_PRODUCT_DIMENSION: (dimensionId) => `/api/dimensions/${dimensionId}`,

    // Images
    GET_PRESIGNED_URL: '/api/images/presigned-url',
    DELETE_IMAGE: (imageId) => `/api/images/${imageId}`,
    GET_IMAGE: (imageId) => `/api/images/${imageId}`,
    UPDATE_IMAGE_STATUS: (imageId) => `/api/images/${imageId}/status`,
    UPDATE_IMAGE_TYPE: (imageId) => `/api/images/${imageId}/type`,
    GET_IMAGES: '/api/images',
    SET_MAIN_IMAGE: (imageId) => `/api/images/${imageId}/set-main`,

    // Users
    USER: {
        ME: '/api/users/me',
        UPDATE_ME: '/api/users/me',
        GET_SELLER: '/api/users/me/seller',
        UPDATE_SELLER: '/api/users/me/seller',
        CREATE_SELLER: '/api/users/me/seller',
        CREATE: '/api/users'
    },

    // Sellers
    SELLER: {
        REGISTER: '/api/sellers/register',
        START_ONBOARDING: '/api/sellers/onboarding/start',
        GET_ONBOARDING_STATUS: '/api/sellers/onboarding/status',
        WEBHOOK: '/api/sellers/webhook',
        RESET_STRIPE: '/api/sellers/reset-stripe',
        GET_DASHBOARD_URL: '/api/sellers/stripe-dashboard'
    },

    LISTING: {
        GET_ALL: '/api/listings',
        GET_ONE: (id) => `/api/listings/${id}`,
        GET_BY_PROPERTY: (propertyId) => `/api/listings/property/${propertyId}`,
        CREATE: '/api/listings',
        UPDATE: (id) => `/api/listings/${id}`,
        DELETE: (id) => `/api/listings/${id}`,
        GET_MY_LISTINGS: '/api/listings/my-listings',
    },

    CONSTANTS: {
        GET_ALL: '/api/constants'
    },

    GET_USER_PROPERTIES: (userId) => `/api/properties/by-user/${userId}`,

    PROPERTY: {
        GET: (id) => `/api/properties/${id}`,
        GET_ALL: '/api/properties',
        GET_USER_PROPERTIES: (userId) => `/api/properties/by-user/${userId}`,
    },

    TRANSACTIONS: {
        CHECKOUT: '/api/transactions/checkout',
        GET: (sessionId) => `/api/transactions/${sessionId}`,
        PURCHASED: '/api/transactions/purchased',
        CHECK: '/api/transactions/check'
    },

    // 所有者チェックAPI
    CHECK_PROPERTY_OWNERSHIP: (propertyId) => `/api/properties/${propertyId}/is-mine`,
    CHECK_ROOM_OWNERSHIP: (roomId) => `/api/rooms/${roomId}/is-mine`,
    CHECK_PRODUCT_OWNERSHIP: (productId) => `/api/products/${productId}/is-mine`,

    // Drawings
    CREATE_DRAWING: '/api/drawings',
    GET_DRAWINGS_BY_PROPERTY: (propertyId) => `/api/drawings/property/${propertyId}`,
    GET_DRAWING: (drawingId) => `/api/drawings/${drawingId}`,
    UPDATE_DRAWING: (drawingId) => `/api/drawings/${drawingId}`,
    DELETE_DRAWING: (drawingId) => `/api/drawings/${drawingId}`,
    CHECK_DRAWING_OWNERSHIP: (drawingId) => `/api/drawings/${drawingId}/is-mine`,
}; 