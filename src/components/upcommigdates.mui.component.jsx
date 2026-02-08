import { Card, CardContent, Typography, Box } from '@mui/material';

const dates = [
  {
    month: 'FEB',
    day: 25,
    title: 'Defensa de la Propuesta',
    description: 'Prepara las diapositivas y el resumen.',
    timeLeft: 'Faltan 6 semanas',
  },
  {
    month: 'MAR',
    day: 10,
    title: 'Envío del 2 Capítulo',
    description: 'Borrador final de la revisión bibliográfica.',
    timeLeft: 'Quedan 9 Semanas',
  },
  {
    month: 'MAR',
    day: 15,
    title: 'Plan de Análisis de Datos',
    description: 'Presentar actualización de metodología.',
    timeLeft: '',
  },
];

export default function UpcomingDates({ activities = [] }) {
  const upcomingActivities = activities
    .filter(a => a.fechaEntrega)
    .sort((a, b) => new Date(a.fechaEntrega) - new Date(b.fechaEntrega))
    .slice(0, 3);

  const mappedDates = upcomingActivities.map(act => {
    const d = new Date(act.fechaEntrega);
    const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];

    // Calcular tiempo restante
    const diffTime = d - new Date();
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    let timeLeft = "";
    if (daysLeft > 0) {
      timeLeft = daysLeft > 7 ? `Quedan ${Math.ceil(daysLeft / 7)} Semanas` : `Faltan ${daysLeft} días`;
    }

    return {
      month: months[d.getMonth()],
      day: d.getDate(),
      title: act.nombre,
      description: act.descripcion || "Sin descripción",
      timeLeft: timeLeft
    };
  });

  return (
    <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Próximas Fechas
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {mappedDates.length > 0 ? mappedDates.map((date, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 2 }}>
              <Box
                sx={{
                  minWidth: 50,
                  textAlign: 'center',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 600,
                    display: 'block',
                  }}
                >
                  {date.month}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {date.day}
                </Typography>
              </Box>

              <Box sx={{ flexGrow: 1, borderLeft: '2px solid #E5E7EB', pl: 2 }}>
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {date.title}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                  {date.description}
                </Typography>
                {date.timeLeft && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#F97316',
                      fontWeight: 500,
                      fontSize: '0.7rem',
                    }}
                  >
                    {date.timeLeft}
                  </Typography>
                )}
              </Box>
            </Box>
          )) : (
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              No hay fechas próximas programadas
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
