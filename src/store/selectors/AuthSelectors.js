export const isAuthenticated = (state) => {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    
    const token = state.auth.auth.token || userDetails?.token;
    const expireDate = state.auth.auth.expireDate || userDetails?.expireDate;
    
    if (token && new Date(expireDate) > new Date()) {
        return true;
    }
    return false;
};
