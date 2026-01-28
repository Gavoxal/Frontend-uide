import { Box, Typography, Card, CardContent, TextField, Grid } from "@mui/material";
import ButtonMUI from "../../../components/button.mui.component";
import SaveIcon from "@mui/icons-material/Save";

function RegisterHotelPage() {
  return (
    <Box>
      {/* Título */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Registro de Hotel
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Complete la información para registrar un nuevo hotel en el sistema.
        </Typography>
      </Box>

      {/* Card principal */}
      <Card sx={{ maxWidth: 900 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre del hotel"
                placeholder="Hotel Internacional"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ciudad"
                placeholder="Quito"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Categoría"
                placeholder="5 estrellas"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Teléfono"
                placeholder="+593 9 9999 9999"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Dirección"
                placeholder="Av. Principal y Secundaria"
              />
            </Grid>

            {/* Botón */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <ButtonMUI
                name="Guardar hotel"
                icon={<SaveIcon />}
                backgroundColor="#000A9B"
                type="submit"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

export default RegisterHotelPage;
