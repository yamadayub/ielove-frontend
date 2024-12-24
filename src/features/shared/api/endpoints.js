export const ENDPOINTS = {
    // Properties
    CREATE_PROPERTY: '/api/properties',
    GET_PROPERTIES: '/api/properties',
    GET_PROPERTY: (propertyId) => `/api/properties/${propertyId}`,
    UPDATE_PROPERTY: (propertyId) => `/api/properties/${propertyId}`,
    DELETE_PROPERTY: (propertyId) => `/api/properties/${propertyId}`,
    GET_PROPERTY_DETAILS: (propertyId) => `/api/properties/${propertyId}/details`,
    CREATE_PROPERTY_WHOLE: '/api/properties/whole',

    // Rooms
    CREATE_ROOM: '/api/rooms',
    GET_ROOMS: '/api/rooms',
    GET_ROOM: (roomId) => `/api/rooms/${roomId}`,
    UPDATE_ROOM: (roomId) => `/api/rooms/rooms/${roomId}`,
    DELETE_ROOM: (roomId) => `/api/rooms/rooms/${roomId}`,
    GET_ROOM_DETAILS: (roomId) => `/api/rooms/${roomId}/details`,

    // Products
    CREATE_PRODUCT: '/api/products',
    GET_PRODUCTS: '/api/products',
    GET_PRODUCT: (productId) => `/api/products/${productId}`,
    UPDATE_PRODUCT: (productId) => `/api/products/${productId}`,
    DELETE_PRODUCT: (productId) => `/api/products/${productId}`,
    GET_PRODUCT_DETAILS: (productId) => `/api/products/${productId}/details`,

    // Images
    GET_PRESIGNED_URL: '/api/images/presigned-url',
    DELETE_IMAGE: (imageId) => `/api/images/${imageId}`,
    GET_IMAGE: (imageId) => `/api/images/${imageId}`,
    COMPLETE_IMAGE_UPLOAD: (imageId) => `/api/images/${imageId}/complete`,
    GET_IMAGES: '/api/images',

    // Users
    USER: {
        ME: '/api/users/me',
        UPDATE_ME: '/api/users/me',
        GET_SELLER: '/api/users/me/seller',
        UPDATE_SELLER: '/api/users/me/seller',
        CREATE_SELLER: '/api/users/me/seller',
        CREATE: '/api/users'
    }
}; 