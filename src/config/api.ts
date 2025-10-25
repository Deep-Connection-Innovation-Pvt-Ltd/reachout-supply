const API_BASE_URL = 'http://localhost/reachout-supply-pri/reachout-supply/backend';
//const API_BASE_URL = 'https://reachout.deepconnection.life/professional/backend';

export const API_ENDPOINTS = {
 // Admin
 ADMIN_LOGIN: `${API_BASE_URL}/admin_login.php`,
 // Applications
 FETCH_APPLICATIONS: (status: 'new' | 'updated' = 'new') =>
 `${API_BASE_URL}/fetch_applications.php?status=${status}`,
 // Payment
 CREATE_ORDER: `${API_BASE_URL}/create_order.php`,
 VERIFY_PAYMENT: `${API_BASE_URL}/verify_payment.php`,
EXCEL_IMPORT: `${API_BASE_URL}/import_applications.php`,
 // Add more endpoints as needed
};
// For backward compatibility
export default {
 API_BASE_URL,
 ...API_ENDPOINTS,
 // Aliases for backward compatibility
 GET_APPLICATIONS: API_ENDPOINTS.FETCH_APPLICATIONS,
 CREATE_PAYMENT: API_ENDPOINTS.CREATE_ORDER,
 LOGIN: API_ENDPOINTS.ADMIN_LOGIN
};
