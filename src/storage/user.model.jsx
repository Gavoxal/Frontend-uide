// Usar sessionStorage nativo en lugar de react-client-session
// para mejor compatibilidad y confiabilidad

export const setUserData = (data) => {
    console.log('Guardando datos de usuario:', data);
    sessionStorage.setItem("sessionUser", JSON.stringify(data));
    console.log('Datos guardados en sessionStorage nativo');
    // Verificar que se guardó
    const verificar = sessionStorage.getItem("sessionUser");
    console.log('Verificación de datos guardados:', verificar);
}

export const rmDataUser = () => {
    sessionStorage.removeItem("sessionUser");
}

export const getDataUser = () => {
    const dataUser = sessionStorage.getItem("sessionUser");
    return dataUser ? JSON.parse(dataUser) : null;
}