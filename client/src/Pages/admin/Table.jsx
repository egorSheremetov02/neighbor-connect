import React, { useState } from "react";
import { useTheme, useMediaQuery } from "@mui/material";
import { 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TablePagination, 
  Button 
} from "@mui/material";

const columns = [
  { id: "name", label: "Neighbour Name", minWidth: 170 },
  { id: "content", label: "Offer Content", minWidth: 170, align: 'left' },
  { id: "actions", label: "Actions", maxWidth: 100, align: "center" }
];

const createData = (name, content) => ({
  name,
  content,
  actions: (
    <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
      <Button variant="contained" color="success" size="small">Approve</Button>
      <Button variant="contained" color="error" size="small">Reject</Button>
    </div>
  )
});

// More compact simulated dataset :)
const rows = Array.from({ length: 20 }, (_, index) => createData(`Offer ${index + 1}`, `Offer ${index + 1} content`));

function OfferTable() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: "none", border: "1px solid #A7A7A7" }}>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{
                    minWidth: isMobile ? 100 : column.minWidth,
                    maxWidth: isMobile ? (column.maxWidth ? 100 : 'auto') : column.maxWidth
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
              <TableRow hover key={index}>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align}>
                    {column.format ? column.format(row[column.id]) : row[column.id]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

export default OfferTable;
