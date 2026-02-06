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
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import StatusBadge from "../common/StatusBadge";

function TableRequisitosMui({ students, onVerify, onGrantAccess }) {
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
                        const allVerified =
                            student.english.verified &&
                            student.internship.verified &&
                            student.community.verified;

                        return (
                            <TableRow key={student.id} hover>
                                <TableCell>{student.name}</TableCell>
                                <TableCell>{student.cedula}</TableCell>
                                <TableCell>{student.career}</TableCell>
                                <TableCell>{student.malla}</TableCell>

                                {/* Inglés */}
                                <TableCell align="center">
                                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
                                        <Checkbox
                                            checked={student.english.verified}
                                            onChange={() => onVerify(student.id, "english")}
                                            disabled={!student.english.completed}
                                            color="success"
                                        />
                                        <Typography variant="caption" color={student.english.completed ? (student.english.verified ? "success" : "error") : "error"}>
                                            {student.english.completed ? (student.english.verified ? "Verificado" : "Por verificar") : "Pendiente"}
                                        </Typography>
                                    </Box>
                                </TableCell>

                                {/* Prácticas */}
                                <TableCell align="center">
                                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
                                        <Checkbox
                                            checked={student.internship.verified}
                                            onChange={() => onVerify(student.id, "internship")}
                                            disabled={!student.internship.completed}
                                            color="success"
                                        />
                                        <Typography variant="caption" color={student.internship.completed ? (student.internship.verified ? "success" : "error") : "error"}>
                                            {student.internship.completed ? (student.internship.verified ? "Verificado" : "Por verificar") : "Pendiente"}
                                        </Typography>
                                    </Box>
                                </TableCell>

                                {/* Vinculación */}
                                <TableCell align="center">
                                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
                                        <Checkbox
                                            checked={student.community.verified}
                                            onChange={() => onVerify(student.id, "community")}
                                            disabled={!student.community.completed}
                                            color="success"
                                        />
                                        <Typography variant="caption" color={student.community.completed ? (student.community.verified ? "success" : "error") : "error"}>
                                            {student.community.completed ? (student.community.verified ? "Verificado" : "Por verificar") : "Pendiente"}
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
                            </TableRow>
                        );
                    })}
                    {students.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                                <Typography color="text.secondary">
                                    No se encontraron estudiantes
                                </Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default TableRequisitosMui;
