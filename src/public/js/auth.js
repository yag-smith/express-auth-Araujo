function parseJWT(token) {
    try {
        const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(base64));
    } catch(e) { return null; }
}

function checkAuth(requiredRole = null) {
    const token = sessionStorage.getItem('token');
    if (!token) { window.location.href = '/signIn'; return null; }
    const payload = parseJWT(token);
    if (!payload || payload.exp * 1000 < Date.now()) {
        sessionStorage.removeItem('token');
        window.location.href = '/signIn';
        return null;
    }
    if (requiredRole && (!payload.roles || !payload.roles.includes(requiredRole))) {
        window.location.href = '/403';
        return null;
    }
    return payload;
}

function logout() {
    sessionStorage.removeItem('token');
    window.location.href = '/signIn';
}

function authHeaders() {
    return {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
    };
}

function calcAge(birthdate) {
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
}
