let API_BASE_URL = "";

if (process.env.NODE_ENV === 'production') {
    API_BASE_URL = "https://api.nicolas-mineo.fr/api";
} else {
    API_BASE_URL = "http://localhost:5000";
}

export default API_BASE_URL;
