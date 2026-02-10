import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Grid,
    CircularProgress,
    Alert,
    Snackbar
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import DefenseList from '../../components/Tutor/DefenseList.mui.component';
import { DefenseService } from '../../services/defense.service';

const TutorDefensas = () => {
    const [defenses, setDefenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

    const fetchDefenses = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await DefenseService.getDefensasJurado();
            setDefenses(data);
        } catch (err) {
            console.error("Error loading defenses:", err);
            setError("No se pudieron cargar las defensas. Por favor, intente nuevamente.");
            setSnackbar({
                open: true,
                message: "Error al cargar defensas",
                severity: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDefenses();
    }, []);

    const handleRefresh = () => {
        fetchDefenses();
    };

    const handleSelectDefense = (defense) => {
        // Future implementation: View details or grade defense

        // Navigate or open dialog here
        setSnackbar({
            open: true,
            message: `Defensa seleccionada: ${defense.tema}`,
            severity: "info"
        });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
                        Defensas Asignadas 
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Gestiona las defensas donde participas como miembro del comité o tutor.
                    </Typography>
                </Box>
                <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={handleRefresh}
                    disabled={loading}
                >
                    Actualizar
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                <CardContent sx={{ p: 0 }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <DefenseList
                            defenses={defenses}
                            onSelectDefense={handleSelectDefense}
                        />
                    )}
                </CardContent>
            </Card>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default TutorDefensas;
