import { useState } from "react";
import { Box, Typography, Button, Alert } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import StudentSideList from "../../components/Coordinador/StudentSideList";
import DocumentCard from "../../components/Coordinador/DocumentCard";

const CoordinadorPrerequisites = () => {
    const navigate = useNavigate();

    // TODO: API - Obtener lista de estudiantes con prerrequisitos
    // const { data: students } = await fetch('/api/coordinador/students/prerequisites')
    const [students] = useState([
        {
            id: 1150373791,
            name: "Eduardo Pardo",
            email: "edupardo@uide.edu.ec",
            timeAgo: "2h ago",
            allApproved: false,
            prerequisites: {
                english: {
                    title: "B2 - Certificado de inglés",
                    status: "approved",
                    fileName: "Certificado_2025.pdf",
                    uploadedAt: "15 Ene 2025"
                },
                internship: {
                    title: "Prácticas Pre-Profesionales",
                    status: "uploaded",
                    fileName: "Certificado_2025.pdf",
                    uploadedAt: "15 Ene 2025"
                },
                community: {
                    title: "Certificado de vinculación",
                    status: "pending_review",
                    fileName: null,
                    uploadedAt: null
                }
            }
        },
        {
            id: 1150373791,
            name: "Gabriel Sarango",
            email: "gsarango@uide.edu.ec",
            timeAgo: "2h ago",
            allApproved: false,
            prerequisites: {
                english: {
                    title: "B2 - Certificado de inglés",
                    status: "uploaded",
                    fileName: "English_Certificate.pdf",
                    uploadedAt: "14 Ene 2025"
                },
                internship: {
                    title: "Prácticas Pre-Profesionales",
                    status: "uploaded",
                    fileName: "Practicas_2025.pdf",
                    uploadedAt: "14 Ene 2025"
                },
                community: {
                    title: "Certificado de vinculación",
                    status: "uploaded",
                    fileName: "Vinculacion.pdf",
                    uploadedAt: "14 Ene 2025"
                }
            }
        },
        {
            id: 1150373791,
            name: "Fernando Castillo",
            email: "fcastillo@uide.edu.ec",
            timeAgo: "2h ago",
            allApproved: true,
            prerequisites: {
                english: {
                    title: "B2 - Certificado de inglés",
                    status: "approved",
                    fileName: "B2_Certificate.pdf",
                    uploadedAt: "10 Ene 2025"
                },
                internship: {
                    title: "Prácticas Pre-Profesionales",
                    status: "approved",
                    fileName: "Internship_Certificate.pdf",
                    uploadedAt: "10 Ene 2025"
                },
                community: {
                    title: "Certificado de vinculación",
                    status: "approved",
                    fileName: "Community_Service.pdf",
                    uploadedAt: "10 Ene 2025"
                }
            }
        },
    ]);

    const [selectedStudent, setSelectedStudent] = useState(students[0]);

    const handleSelectStudent = (student) => {
        setSelectedStudent(student);
    };

    const handleDeny = () => {
        // TODO: API - Denegar solicitud de prerrequisitos
        // await fetch(`/api/coordinador/students/${selectedStudent.id}/prerequisites/deny`, { method: 'POST' })
        console.log('Denegar solicitud:', selectedStudent);
        alert(`Solicitud denegada para ${selectedStudent.name}`);
    };

    const handleApprove = () => {
        // TODO: API - Aprobar solicitud de prerrequisitos
        // await fetch(`/api/coordinador/students/${selectedStudent.id}/prerequisites/approve`, { method: 'POST' })
        console.log('Aprobar solicitud:', selectedStudent);
        alert(`Solicitud aprobada para ${selectedStudent.name}`);
    };

    return (
        <Box sx={{ display: 'flex', height: 'calc(100vh - 100px)' }}>
            {/* Panel Lateral - Lista de Estudiantes */}
            <StudentSideList
                students={students}
                selectedStudentId={selectedStudent?.id}
                onSelectStudent={handleSelectStudent}
            />

            {/* Panel Principal - Detalle del Estudiante */}
            <Box sx={{ flex: 1, p: 4, overflow: 'auto' }}>
                {/* Botón de regreso */}
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/coordinador/dashboard')}
                    sx={{ mb: 3 }}
                >
                    TABLERO
                </Button>

                {/* Título */}
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Revisión de Prerrequisitos
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                    Revisa y aprueba la información del estudiante
                </Typography>

                {selectedStudent && (
                    <>
                        {/* Información del Estudiante */}
                        <Box sx={{ mb: 4, p: 3, bgcolor: '#F5F5F5', borderRadius: 2 }}>
                            <Typography variant="h6" fontWeight="bold">
                                {selectedStudent.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                ID: {selectedStudent.id}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {selectedStudent.email}
                            </Typography>
                        </Box>

                        {/* Alerta informativa */}
                        <Alert severity="info" sx={{ mb: 3 }}>
                            Revisa cada documento cargado por el estudiante. Puedes aprobar o denegar la solicitud.
                        </Alert>

                        {/* Documentos de Prerrequisitos */}
                        <DocumentCard document={selectedStudent.prerequisites.english} />
                        <DocumentCard document={selectedStudent.prerequisites.internship} />
                        <DocumentCard document={selectedStudent.prerequisites.community} />

                        {/* Botones de Acción */}
                        <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                            <Button
                                variant="outlined"
                                color="error"
                                size="large"
                                fullWidth
                                onClick={handleDeny}
                            >
                                Denegar Solicitud
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                fullWidth
                                onClick={handleApprove}
                            >
                                Aprobar Solicitud
                            </Button>
                        </Box>
                    </>
                )}
            </Box>
        </Box>
    );
};

export default CoordinadorPrerequisites;
