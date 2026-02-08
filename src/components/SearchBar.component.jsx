import React from 'react';
import { Box, Typography, InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

/**
 * Componente de barra de búsqueda reutilizable con diseño moderno
 * @param {string} value - Valor actual del input
 * @param {function} onChange - Función callback para cambios
 * @param {string} placeholder - Texto placeholder
 * @param {string} title - Título de la barra de búsqueda (opcional)
 */
function SearchBar({ value, onChange, placeholder = "Buscar...", title = "Buscar" }) {
    return (
        <Box sx={{ mb: 3 }}>
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                    borderRadius: 3,
                    p: 2.5,
                    boxShadow: '0 4px 15px rgba(25, 118, 210, 0.2)'
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                    <SearchIcon sx={{ color: 'white', fontSize: 24 }} />
                    <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                        {title}
                    </Typography>
                </Box>
                <TextField
                    fullWidth
                    size="small"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: '#757575' }} />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        bgcolor: 'white',
                        borderRadius: 2,
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'transparent'
                            },
                            '&:hover fieldset': {
                                borderColor: 'rgba(25, 118, 210, 0.3)'
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#1976d2',
                                borderWidth: 2
                            }
                        }
                    }}
                />
            </Box>
        </Box>
    );
}

export default SearchBar;
