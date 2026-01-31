export function LoginService(user, passwd) {
  // Primero revisamos si hay un registro temporal
  const tempUser = JSON.parse(sessionStorage.getItem('tempUser'));

  if (tempUser && user === tempUser.user && passwd === tempUser.passwd) {
    return {
      name: tempUser.name,
      lastName: tempUser.lastname,
      role: "user",  // Rol por defecto para usuarios registrados
      image: "",
    };
  }

  // O el usuario admin predefinido
  if (user === "admin" && passwd === "admin123") {
    return {
      name: "Administrador",
      lastName: "Main",
      role: "admin",
      image: "",
    };
  }

  // O el usuario tutor predefinido
  if (user === "tutor" && passwd === "tutor123") {
    return {
      name: "Tutor",
      lastName: "Main",
      role: "tutor",
      image: "",
    };
  }

  // O el usuario estudiante predefinido
  if (user === "estudiante" && passwd === "estudiante123") {
    return {
      name: "Estudiante",
      lastName: "Main",
      role: "estudiante",
      image: "",
    };
  }

  // O el usuario docente de integración predefinido
  if (user === "docente" && passwd === "docente123") {
    return {
      name: "Docente",
      lastName: "Integración",
      role: "docente_integracion",
      image: "",
    };
  }

  return null; // Login fallido
}
