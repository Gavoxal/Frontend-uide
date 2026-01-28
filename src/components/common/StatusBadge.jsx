import { Chip } from "@mui/material";

const STATUS_COLORS = {
    pending: "warning",
    "in-progress": "info",
    approved: "success",
    rejected: "error",
    completed: "success",
};

const STATUS_LABELS = {
    pending: "Pendiente",
    "in-progress": "En Progreso",
    approved: "Aprobado",
    rejected: "Rechazado",
    completed: "Completado",
};

function StatusBadge({ status, label }) {
    const displayLabel = label || STATUS_LABELS[status] || status;
    const color = STATUS_COLORS[status] || "default";

    return (
        <Chip
            label={displayLabel}
            color={color}
            size="small"
            sx={{
                fontWeight: "bold",
                textTransform: "capitalize",
            }}
        />
    );
}

export default StatusBadge;
