import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Typography } from '@mui/material';

export default function TableMui({ headers, data, actions }) {
  // Guard clause for empty or missing props
  if (!headers) {
    return <Typography sx={{ p: 2 }}>Error: No headers provided to TableMui</Typography>;
  }

  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
      <Table sx={{ minWidth: 650 }} aria-label="dynamic table">
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f9fafb' }}>
            {headers.map((header, index) => (
              <TableCell key={index} align="left" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                {header}
              </TableCell>
            ))}
            {actions && (
              <TableCell align="center" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                Acciones
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {data && data.length > 0 ? (
            data.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: '#f5f5f5' } }}
              >
                {/* Dynamically render cells based on object values. 
                    Be careful with object order; usually better to map by specific keys if strict order needed. 
                    For this generic component, we assume object keys order matches headers or caller prepares data. */}
                {Object.values(row).map((cell, cellIndex) => (
                  <TableCell key={cellIndex} align="left">
                    {cell}
                  </TableCell>
                ))}
                {actions && (
                  <TableCell align="center">
                    {actions(row, rowIndex)}
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={headers.length + (actions ? 1 : 0)} align="center">
                <Typography variant="body2" sx={{ py: 4, color: 'text.secondary', fontStyle: 'italic' }}>
                  No se encontraron registros disponibles
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}