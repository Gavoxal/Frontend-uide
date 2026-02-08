import { useState } from "react";
import {
    Box,
    Typography,
    IconButton,
    Paper,
    Chip,
    ToggleButtonGroup,
    ToggleButton,
} from "@mui/material";
import {
    ChevronLeft,
    ChevronRight,
    CalendarToday,
    Today,
    Add,
} from "@mui/icons-material";

const DAYS_OF_WEEK = ["LUN.", "MAR.", "MIÉ.", "JUE.", "VIE.", "SÁB.", "DOM."];
const MONTHS = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
];

function CalendarMui({ events = [], onDateClick, onEventClick, showViewToggle = true, showAddButton = true }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState("month"); // month, week, agenda

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Navegar entre meses
    const navigateMonth = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(month + direction);
        setCurrentDate(newDate);
    };

    // Ir a hoy
    const goToToday = () => {
        setCurrentDate(new Date());
    };

    // Obtener días del mes
    const getDaysInMonth = () => {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

        const days = [];

        // Días del mes anterior (grises)
        const prevMonthDays = new Date(year, month, 0).getDate();
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            days.push({
                day: prevMonthDays - i,
                isCurrentMonth: false,
                date: new Date(year, month - 1, prevMonthDays - i),
            });
        }

        // Días del mes actual
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                day: i,
                isCurrentMonth: true,
                date: new Date(year, month, i),
            });
        }

        // Días del mes siguiente (grises)
        const remainingDays = 42 - days.length;
        for (let i = 1; i <= remainingDays; i++) {
            days.push({
                day: i,
                isCurrentMonth: false,
                date: new Date(year, month + 1, i),
            });
        }

        return days;
    };

    // Obtener eventos para una fecha específica
    const getEventsForDate = (date) => {
        if (!date) return [];
        const dateString = date.toDateString();
        return events.filter(event => {
            if (!event.date) return false;
            try {
                const eventDate = new Date(event.date);
                return eventDate.toDateString() === dateString;
            } catch (e) {
                return false;
            }
        });
    };

    // Verificar si es hoy
    const isToday = (date) => {
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

    const days = getDaysInMonth();

    return (
        <Paper
            elevation={2}
            sx={{
                backgroundColor: "#ffffff",
                color: "#000",
                borderRadius: 2,
                overflow: "hidden",
                border: '1px solid #e0e0e0'
            }}
        >
            {/* HEADER */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 2,
                    backgroundColor: "#f9fafb",
                    borderBottom: '1px solid #e0e0e0'
                }}
            >
                {/* Navegación y título */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <IconButton
                        onClick={goToToday}
                        sx={{
                            backgroundColor: "#000A9B",
                            color: "white",
                            "&:hover": { backgroundColor: "#0011cc" },
                            borderRadius: 1,
                            px: 2,
                        }}
                    >
                        <Today sx={{ mr: 1 }} />
                        <Typography variant="body2">Hoy</Typography>
                    </IconButton>

                    <IconButton
                        onClick={() => navigateMonth(-1)}
                        sx={{ color: "#000" }}
                    >
                        <ChevronLeft />
                    </IconButton>

                    <IconButton
                        onClick={() => navigateMonth(1)}
                        sx={{ color: "#000" }}
                    >
                        <ChevronRight />
                    </IconButton>

                    <Typography variant="h6" sx={{ fontWeight: 600, minWidth: 180, color: '#000' }}>
                        {MONTHS[month]} {year}
                    </Typography>
                </Box>

                {/* Botones de vista y agregar */}
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    {showViewToggle && (
                        <ToggleButtonGroup
                            value={view}
                            exclusive
                            onChange={(e, newView) => newView && setView(newView)}
                            sx={{
                                "& .MuiToggleButton-root": {
                                    color: "#000",
                                    borderColor: "rgba(0,0,0,0.2)",
                                    "&.Mui-selected": {
                                        backgroundColor: "#000A9B",
                                        color: "white",
                                    },
                                },
                            }}
                        >
                            <ToggleButton value="week">Semana</ToggleButton>
                            <ToggleButton value="month">Mes</ToggleButton>
                            <ToggleButton value="agenda">Agenda</ToggleButton>
                        </ToggleButtonGroup>
                    )}

                    {showAddButton && (
                        <IconButton
                            sx={{
                                backgroundColor: "#000A9B",
                                color: "white",
                                "&:hover": { backgroundColor: "#0011cc" },
                            }}
                        >
                            <Add />
                        </IconButton>
                    )}
                </Box>
            </Box>

            {/* DÍAS DE LA SEMANA */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: 0,
                    backgroundColor: "#f5f5f5",
                    borderBottom: "1px solid #e0e0e0",
                }}
            >
                {DAYS_OF_WEEK.map((day) => (
                    <Box
                        key={day}
                        sx={{
                            p: 1.5,
                            textAlign: "center",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            fontWeight: 600,
                            color: "text.secondary",
                        }}
                    >
                        {day}
                    </Box>
                ))}
            </Box>

            {/* CALENDARIO */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: 0,
                    backgroundColor: "#ffffff",
                }}
            >
                {days.map((dayInfo, index) => {
                    const dayEvents = getEventsForDate(dayInfo.date);
                    const today = isToday(dayInfo.date);

                    return (
                        <Box
                            key={index}
                            onClick={() => onDateClick && onDateClick(dayInfo.date)}
                            sx={{
                                minHeight: 120,
                                p: 1,
                                borderBottom: "1px solid #e0e0e0",
                                borderRight: "1px solid #e0e0e0",
                                cursor: onDateClick ? "pointer" : "default",
                                backgroundColor: today
                                    ? "rgba(0, 10, 155, 0.1)"
                                    : "transparent",
                                "&:hover": {
                                    backgroundColor: onDateClick
                                        ? "#f5f5f5"
                                        : "transparent",
                                },
                                transition: "background-color 0.2s",
                            }}
                        >
                            {/* Número del día */}
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    mb: 0.5,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 28,
                                        height: 28,
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "0.875rem",
                                        fontWeight: today ? 700 : 500,
                                        color: today
                                            ? "white"
                                            : dayInfo.isCurrentMonth
                                                ? "#000"
                                                : "#aaa",
                                        backgroundColor: today ? "#000A9B" : "transparent",
                                    }}
                                >
                                    {dayInfo.day}
                                </Box>
                            </Box>

                            {/* Eventos */}
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                                {dayEvents.slice(0, 3).map((event, idx) => (
                                    <Chip
                                        key={idx}
                                        label={event.title}
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEventClick && onEventClick(event);
                                        }}
                                        sx={{
                                            backgroundColor: event.color || "#00c853",
                                            color: "white",
                                            fontSize: "0.7rem",
                                            height: 20,
                                            cursor: "pointer",
                                            "& .MuiChip-label": {
                                                px: 1,
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                            },
                                            "&:hover": {
                                                opacity: 0.8,
                                            },
                                        }}
                                        icon={
                                            event.time ? (
                                                <Box
                                                    component="span"
                                                    sx={{
                                                        fontSize: "0.65rem",
                                                        color: "white",
                                                        ml: 0.5,
                                                    }}
                                                >
                                                    {event.time}
                                                </Box>
                                            ) : undefined
                                        }
                                    />
                                ))}
                                {dayEvents.length > 3 && (
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            fontSize: "0.65rem",
                                            color: "#666",
                                            textAlign: "center",
                                        }}
                                    >
                                        +{dayEvents.length - 3} más
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    );
                })}
            </Box>
        </Paper>
    );
}

export default CalendarMui;
