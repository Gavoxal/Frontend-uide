export function LoginService(user, passwd) {
  // Primero revisamos si hay un registro temporal
  const tempUser = JSON.parse(sessionStorage.getItem('tempUser'));

  if (tempUser && user === tempUser.user && passwd === tempUser.passwd) {
    // Guardar email para UserProgressContext
    localStorage.setItem('userEmail', user);

    return {
      name: tempUser.name,
      lastName: tempUser.lastname,
      role: tempUser.role,  // Usar el rol que el usuario seleccionó en el registro
      image: "",
    };
  }

  // Usuario admin predefinido
  if (user === "admin" && passwd === "admin123") {
    localStorage.setItem('userEmail', user);
    return {
      name: "Administrador",
      lastName: "Main",
      role: "admin",
      image: "",
    };
  }

  // Usuario tutor predefinido
  if (user === "tutor" && passwd === "tutor123") {
    localStorage.setItem('userEmail', user);
    return {
      name: "Tutor",
      lastName: "Main",
      role: "tutor",
      image: "",
    };
  }

  // === USUARIOS DE PRUEBA PARA SISTEMA DE ACCESO ===

  // Usuario estudiante con acceso RESTRINGIDO (sin prerrequisitos aprobados)
  if (user === "estudiante_nuevo@uide.edu.ec" && passwd === "123456") {
    localStorage.setItem('userEmail', user);
    return {
      name: "Juan",
      lastName: "Pérez",
      role: "student",
      image: "",
    };
  }

  // Usuario estudiante con acceso COMPLETO (prerrequisitos aprobados + 15 semanas)
  if (user === "estudiante_completo@uide.edu.ec" && passwd === "123456") {
    localStorage.setItem('userEmail', user);
    return {
      name: "María",
      lastName: "García",
      role: "student",
      image: "",
    };
  }

  // Usuario estudiante con acceso INTERMEDIO (prerrequisitos aprobados, 8 semanas)
  if (user === "estudiante_avanzado@uide.edu.ec" && passwd === "123456") {
    localStorage.setItem('userEmail', user);
    return {
      name: "Carlos",
      lastName: "López",
      role: "student",
      image: "",
    };
  }

  // Usuario estudiante predefinido (LEGACY - acceso completo)
  if (user === "estudiante" && passwd === "estudiante123") {
    localStorage.setItem('userEmail', "estudiante_completo@uide.edu.ec");
    return {
      name: "Abel",
      lastName: "Main",
      role: "student",
      image: "",
    };
  }

  // Usuario revisor predefinido
  if (user === "revisor" && passwd === "revisor123") {
    localStorage.setItem('userEmail', user);
    return {
      name: "Revisor",
      lastName: "Main",
      role: "reviewer",
      image: "",
    };
  }

  return null; // Login fallido
}
