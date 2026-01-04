export const API_CONFIG = {
  // Replace with your actual backend URL
  // For local development, use: 'http://localhost:8000'
  // For production, use your deployed backend URL
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000', 
  ENDPOINTS: {
    // Backend route: /v1/documents/process-document
    PROCESS_DOCUMENT: '/v1/documents/process-document',
  },
  // Default headers if needed (e.g., for API keys)
  HEADERS: {
    // 'Authorization': 'Bearer YOUR_API_KEY'
  }
};