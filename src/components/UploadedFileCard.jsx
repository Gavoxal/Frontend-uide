import { Box, Typography, IconButton, Paper } from '@mui/material';
import { Description as DescriptionIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';

export default function UploadedFileCard({ fileName, requirementName, onDelete, onView }) {
    return (
        <Paper
            variant="outlined"
            sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: 'background.paper',
                borderRadius: 2,
                mt: 2
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, overflow: 'hidden' }}>
                <Box
                    sx={{
                        width: 40,
                        height: 40,
                        minWidth: 40,
                        bgcolor: 'primary.light',
                        color: 'primary.main',
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <DescriptionIcon />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" fontWeight="bold" noWrap>
                        {requirementName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap display="block">
                        {fileName}
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                {onView && (
                    <IconButton size="small" onClick={onView}>
                        <VisibilityIcon fontSize="small" />
                    </IconButton>
                )}
                {onDelete && (
                    <IconButton size="small" color="error" onClick={onDelete}>
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                )}
            </Box>
        </Paper>
    );
}
