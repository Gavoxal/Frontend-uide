import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export default function UpcomingDateCard({ date, title }) {
  const displayDate = date ? new Date(date) : null;
  const formattedDate = displayDate ? displayDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) : "--";
  const label = title || "No hay tareas próximas";

  // Calcular semanas restantes
  let weeksLeft = 0;
  if (displayDate) {
    const diffTime = displayDate - new Date();
    weeksLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
  }

  return (
    <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AccessTimeIcon sx={{ color: '#F97316', mr: 1 }} />
          <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
            Próxima Fecha Importante
          </Typography>
        </Box>

        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          {formattedDate}
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          {label}
        </Typography>

        {weeksLeft > 0 && (
          <Chip
            label={`Quedan ${weeksLeft} Semanas`}
            sx={{
              backgroundColor: '#FED7AA',
              color: '#9A3412',
              fontWeight: 500,
              fontSize: '0.75rem',
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}
