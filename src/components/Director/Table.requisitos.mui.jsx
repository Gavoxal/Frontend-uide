import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Checkbox,
    Chip,
    Tooltip,
    IconButton
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import VisibilityIcon from "@mui/icons-material/Visibility";
import StatusBadge from "../common/StatusBadge";

function TableRequisitosMui({ students, onVerify, onGrantAccess, onDownload = () => { } }) {
    return (
        <TableContainer component={Paper} variant="outlined">
            <Table>
                <TableHead>
                    <TableRow sx={{ backgroundColor: "#F4F6F8" }}>
                        <TableCell><strong>Estudiante</strong></TableCell>
                        <TableCell><strong>Cédula</strong></TableCell>
                        <TableCell><strong>Carrera</strong></TableCell>
                        <TableCell><strong>Malla</strong></TableCell>
                        <TableCell align="center"><strong>Inglés</strong></TableCell>
                        <TableCell align="center"><strong>Prácticas</strong></TableCell>
                        <TableCell align="center"><strong>Vinculación</strong></TableCell>
                        <TableCell align="center"><strong>Estado</strong></TableCell>
                        <TableCell align="center"><strong>Acceso a Anteproyecto</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {students.map((student) => {
                        const english = student.english || { completed: false, verified: false, file: null };
                        const internship = student.internship || { completed: false, verified: false, file: null };
                        const community = student.community || { completed: false, verified: false, file: null };
                        const allVerified =
                            english.verified &&
                            internship.verified &&
                            community.verified;

                        return (
                            <TableRow key={student.id} hover>
                                <TableCell>{student.name}</TableCell>
                                <TableCell>{student.cedula}</TableCell>
                                <TableCell>{student.career}</TableCell>
                                <TableCell>{student.malla}</TableCell>

                                {/* Inglés */}
                                <TableCell align="center">
                                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Checkbox
                                                checked={english.verified}
                                                onChange={() => onVerify(student.id, "english")}
                                                disabled={!english.completed}
                                                color="success"
                                            />
                                            {english.file && (
                                                <Tooltip title="Ver archivo">
                                                    <IconButton size="small" onClick={() => onDownload(english.file, "Certificado de Inglés")}>
                                                        <VisibilityIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </Box>
                                        <Typography variant="caption" color={english.completed ? (english.verified ? "success" : "error") : "error"}>
                                            {english.completed ? (english.verified ? "Verificado" : "Por verificar") : "Pendiente"}
                                        </Typography>
                                    </Box>
                                </TableCell>

                                {/* Prácticas */}
                                <TableCell align="center">
                                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Checkbox
                                                checked={internship.verified}
                                                onChange={() => onVerify(student.id, "internship")}
                                                disabled={!internship.completed}
                                                color="success"
                                            />
                                            {internship.file && (
                                                <Tooltip title="Ver archivo">
                                                    <IconButton size="small" onClick={() => onDownload(internship.file, "Certificado de Prácticas")}>
                                                        <VisibilityIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </Box>
                                        <Typography variant="caption" color={internship.completed ? (internship.verified ? "success" : "error") : "error"}>
                                            {internship.completed ? (internship.verified ? "Verificado" : "Por verificar") : "Pendiente"}
                                        </Typography>
                                    </Box>
                                </TableCell>

                                {/* Vinculación */}
                                <TableCell align="center">
                                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Checkbox
                                                checked={community.verified}
                                                onChange={() => onVerify(student.id, "community")}
                                                disabled={!community.completed}
                                                color="success"
                                            />
                                            {community.file && (
                                                <Tooltip title="Ver archivo">
                                                    <IconButton size="small" onClick={() => onDownload(community.file, "Certificado de Vinculación")}>
                                                        <VisibilityIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </Box>
                                        <Typography variant="caption" color={community.completed ? (community.verified ? "success" : "error") : "error"}>
                                            {community.completed ? (community.verified ? "Verificado" : "Por verificar") : "Pendiente"}
                                        </Typography>
                                    </Box>
                                </TableCell>

                                {/* Estado General */}
                                <TableCell align="center">
                                    <StatusBadge status={allVerified ? "approved" : "pending"} />
                                </TableCell>

                                {/* Botón de Acceso */}
                                <TableCell align="center">
                                    {student.accessGranted ? (
                                        <Chip
                                            icon={<CheckCircleIcon />}
                                            label="Habilitado"
                                            color="success"
                                            variant="outlined"
                                            size="small"
                                        />
                                    ) : (
                                        <Tooltip title="Habilitar acceso a propuesta de tesis" placement="top">
                                            <span>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    size="small"
                                                    startIcon={<VpnKeyIcon />}
                                                    disabled={!allVerified}
                                                    onClick={() => onGrantAccess(student)}
                                                >
                                                    Habilitar
                                                </Button>
                                            </span>
                                        </Tooltip>
                                    )}
                                </TableCell>
                            </TableRow >
                        );
                    })}
                    {
                        students.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                                    <Typography color="text.secondary">
                                        No se encontraron estudiantes
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )
                    }
                </TableBody >
            </Table >
        </TableContainer >
    );
}

export default TableRequisitosMui;
