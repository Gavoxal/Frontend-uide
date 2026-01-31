// Lista de nombres reales para pruebas
const realNames = [
    "Eduardo Pardo", "Gabriel Sarango", "Fernando Castillo", "Maria Rodriguez",
    "Juan Perez", "Ana Lopez", "Carlos Sanchez", "Luis Gomez",
    "Sofia Martinez", "Lucia Fernandez", "Miguel Torres", "Elena Ramirez",
    "David Morales", "Paula Herrera", "Javier Castro", "Andrea Vargas"
];

const thesisTopics = [
    "Implementación de IA en Educación",
    "Sistema de Gestión Hospitalaria",
    "App Móvil para Turismo Local",
    "Seguridad en Redes IoT",
    "Análisis de Datos Climáticos",
    "Plataforma de E-commerce Artesanal"
];

export const weeksData = Array.from({ length: 15 }, (_, i) => {
    const weekNum = i + 1;
    // Generar algunos estudiantes aleatorios para cada semana
    const studentsCount = Math.floor(Math.random() * 4) + 1; // 1 a 4 estudiantes por semana

    const students = Array.from({ length: studentsCount }, (_, j) => {
        const randomName = realNames[Math.floor(Math.random() * realNames.length)];
        const randomTopic = thesisTopics[Math.floor(Math.random() * thesisTopics.length)];

        return {
            id: `s-${weekNum}-${j}`,
            name: randomName,
            cedula: `1700${weekNum}${j}00`,
            tema: randomTopic,
            status: Math.random() > 0.5 ? 'pending' : 'reviewed',
            submittedAt: '2025-02-15',
            summary: "En esta semana me enfoque en la limpieza de los datos obtenidos de la API de Twitter. Se aplicaron filtros de lenguaje, eliminacion de duplicados y normalizacion de texto.",
            files: [
                { name: "thesis_analysis_draft_v1.pdf", type: "pdf", size: "2.4 MB" },
                { name: "source_code_python.zip", type: "zip", size: "14.8 MB" }
            ],
            feedback: []
        };
    });

    return {
        id: weekNum,
        label: `Semana ${weekNum}`,
        description: `Avances correspondientes a la semana ${weekNum}`,
        students: students
    };
});

export const getPendingCount = () => {
    let count = 0;
    weeksData.forEach(week => {
        count += week.students.filter(s => s.status === 'pending').length;
    });
    return count;
    return count;
};

export const recentActivity = [
    {
        id: "s-15-0",
        name: "Jhandry Becerra",
        cedula: "1184523",
        tema: "Block Chain Security",
        fecha: "Dic 15",
        weekId: 15
    },
    {
        id: "s-14-1",
        name: "Gabriel Sarango",
        cedula: "1184524",
        tema: "AI in Healthcare",
        fecha: "Dic 14",
        weekId: 14
    },
    {
        id: "s-13-2",
        name: "Eduardo Pardo",
        cedula: "1184525",
        tema: "IoT Smart City",
        fecha: "Dic 13",
        weekId: 13
    },
    {
        id: "s-15-3",
        name: "Fernando Castillo",
        cedula: "1184526",
        tema: "E-commerce Platform",
        fecha: "Dic 15",
        weekId: 15
    },
    {
        id: "s-12-0",
        name: "Luis Poma",
        cedula: "1184527",
        tema: "Cybersecurity Audit",
        fecha: "Dic 12",
        weekId: 12
    }
];
