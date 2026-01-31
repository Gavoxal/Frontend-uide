import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function TableMui({ headers = [], data = [], actions = null }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {headers.map((header, index) => (
              <TableCell key={index} align={index === 0 ? "left" : "right"}>
                {header}
              </TableCell>
            ))}
            {actions && <TableCell align="right">Acciones</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                {headers.map((header, colIndex) => {
                  // Assuming row is an object where keys match the order or logic of headers is handled by the parent transforming data
                  // For simplicity, we'll map object values. Ideally, data should be an array of objects where values correspond to headers order, 
                  // OR we pass columns config. 
                  // Let's assume 'row' is an object and we just iterate its values or specific keys if provided.
                  // A safer generic approach often involves a 'columns' prop defining key -> header map.
                  // Given the previous code was simple, I'll assume 'data' contains objects with keys matching what we want to display, 
                  // BUT generic tables are tricky without a schema.
                  // Let's rely on the parent passing structured data values in the right order or an array of values for each row to be safe?
                  // No, let's look at the object keys.
                  // Better approach for a generic component: passing 'columns' prop with { label, id }.
                  // Since I need to stick to the signature implied so far, I will assume `data` is an array of objects 
                  // and I will try to render the values in the order of keys, OR render simply if row is an array.
                  // Let's go with a `columns` prop approach inside `headers`? 
                  // No, the user prompt implies simple refactor. 
                  // Let's assume 'data' is an array of objects and we show `Object.values(row)`.
                  const cellValue = Object.values(row)[colIndex];
                  return (
                    <TableCell key={colIndex} component={colIndex === 0 ? "th" : "td"} scope={colIndex === 0 ? "row" : undefined} align={colIndex === 0 ? "left" : "right"}>
                      {cellValue}
                    </TableCell>
                  )
                })}
                {actions && (
                  <TableCell align="right">
                    {actions(row, rowIndex)}
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={headers.length + (actions ? 1 : 0)} align="center">
                No hay datos disponibles
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TableMui;
