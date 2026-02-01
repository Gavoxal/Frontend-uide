export function LoginService(user, passwd) {
  // Primero revisamos si hay un registro temporal
  const tempUser = JSON.parse(sessionStorage.getItem('tempUser'));

  if (tempUser && user === tempUser.user && passwd === tempUser.passwd) {
    return {
      name: tempUser.name,
      lastName: tempUser.lastname,
      role: tempUser.role,  // Usar el rol que el usuario seleccionó en el registro
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
      name: "Abel",
      lastName: "Main",
      role: "student",  // Cambiado de "estudiante" a "student" para que coincida con navigateUser
      image: "",
    };
  }

  // O el usuario revisor predefinido
  if (user === "revisor" && passwd === "revisor123") {
    return {
      name: "Revisor",
      lastName: "Main",
      role: "reviewer",  // Cambiado de "revisor" a "reviewer" para que coincida con navigateUser
      image: "",
    };
  }

  return null; // Login fallido
}
