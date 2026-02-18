// Usar sessionStorage nativo en lugar de react-client-session
// para mejor compatibilidad y confiabilidad

export const setUserData = (data) => {

    sessionStorage.setItem("sessionUser", JSON.stringify(data));

    // Verificar que se guardó
    const verificar = sessionStorage.getItem("sessionUser");

}

export const rmDataUser = () => {
    sessionStorage.removeItem("sessionUser");
    sessionStorage.removeItem("activeRole");
}

export const getDataUser = () => {
    const dataUser = sessionStorage.getItem("sessionUser");
    return dataUser ? JSON.parse(dataUser) : null;
}

export const setActiveRole = (role) => {
    sessionStorage.setItem("activeRole", role);
}

export const getActiveRole = () => {
    return sessionStorage.getItem("activeRole");
}
