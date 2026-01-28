import {
    Box,
    Typography,
    Card,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";

function ListHotelsPage() {
    // Datos de ejemplo - en producción vendrían de una API
    const hoteles = [
        { id: 1, nombre: "Hotel Central", ciudad: "Quito", categoria: "5 estrellas", telefono: "+593 2 1234567" },
        { id: 2, nombre: "Hotel Plaza", ciudad: "Guayaquil", categoria: "4 estrellas", telefono: "+593 4 7654321" },
        { id: 3, nombre: "Hotel Colonial", ciudad: "Cuenca", categoria: "3 estrellas", telefono: "+593 7 9876543" },
    ];

    return (
        <Box>
            {/* Título */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" fontWeight="bold">
                    Lista de Hoteles
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Todos los hoteles registrados en el sistema
                </Typography>
            </Box>

            {/* Tabla de hoteles */}
            <Card>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#F4F6F8" }}>
                                <TableCell><strong>ID</strong></TableCell>
                                <TableCell><strong>Nombre</strong></TableCell>
                                <TableCell><strong>Ciudad</strong></TableCell>
                                <TableCell><strong>Categoría</strong></TableCell>
                                <TableCell><strong>Teléfono</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {hoteles.map((hotel) => (
                                <TableRow key={hotel.id} hover>
                                    <TableCell>{hotel.id}</TableCell>
                                    <TableCell>{hotel.nombre}</TableCell>
                                    <TableCell>{hotel.ciudad}</TableCell>
                                    <TableCell>{hotel.categoria}</TableCell>
                                    <TableCell>{hotel.telefono}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </Box>
    );
}

export default ListHotelsPage;

