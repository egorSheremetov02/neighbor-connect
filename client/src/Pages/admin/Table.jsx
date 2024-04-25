import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Button } from "@mui/material";

const columns = [
  { id: "name", label: "Neighbour Name", minWidth: 170 },
  {
    id: "content",
    label: "Offer Content",
    minWidth: 170,
    align: 'left',
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "actions",
    label: "Actions",
    maxWidth: 70,
    align: "right",
    // format: (value) => value.toFixed(2),
  },
];

function createData(name, content, actions) {
  return { name, content, actions };
}

const data = [
  {
    name: "Offer 1",
    content: "Offer 1 content",
    actions: (
      <div className="flex gap-3 justify-end">
        <Button variant={"contained"} color="success">Approve</Button>{" "}
        <Button variant={"contained"} color="error">Reject</Button>
      </div>
    ),
  },
  {
    name: "Offer 2",
    content: "Offer 2 content",
    actions: (
      <div className="flex gap-3 justify-end">
        <Button variant={"contained"} color="success">Approve</Button>{" "}
        <Button variant={"contained"} color="error">Reject</Button>
      </div>
    ),
  },
  {
    name: "Offer 3",
    content: "Offer 3 content",
    actions: (
      <div className="flex gap-3 justify-end">
        <Button variant={"contained"} color="success">Approve</Button>{" "}
        <Button variant={"contained"} color="error">Reject</Button>
      </div>
    ),
  },
  {
    name: "Offer 4",
    content: "Offer 4 content",
    actions: (
      <div className="flex gap-3 justify-end">
        <Button variant={"contained"} color="success">Approve</Button>{" "}
        <Button variant={"contained"} color="error">Reject</Button>
      </div>
    ),
  },
  {
    name: "Offer 5",
    content: "Offer 5 content",
    actions: (
      <div className="flex gap-3 justify-end">
        <Button variant={"contained"} color="success">Approve</Button>{" "}
        <Button variant={"contained"} color="error">Reject</Button>
      </div>
    ),
  },
  {
    name: "Offer 6",
    content: "Offer 6 content",
    actions: (
      <div className="flex gap-3 justify-end">
        <Button variant={"contained"} color="success">Approve</Button>{" "}
        <Button variant={"contained"} color="error">Reject</Button>
      </div>
    ),
  },
  {
    name: "Offer 7",
    content: "Offer 7 content",
    actions: (
      <div className="flex gap-3 justify-end">
        <Button variant={"contained"} color="success">Approve</Button>{" "}
        <Button variant={"contained"} color="error">Reject</Button>
      </div>
    ),
  },
  {
    name: "Offer 8",
    content: "Offer 8 content",
    actions: (
      <div className="flex gap-3 justify-end">
        <Button variant={"contained"} color="success">Approve</Button>{" "}
        <Button variant={"contained"} color="error">Reject</Button>
      </div>
    ),
  },
  {
    name: "Offer 9",
    content: "Offer 9 content",
    actions: (
      <div className="flex gap-3 justify-end">
        <Button variant={"contained"} color="success">Approve</Button>{" "}
        <Button variant={"contained"} color="error">Reject</Button>
      </div>
    ),
  },
  {
    name: "Offer 10",
    content: "Offer 10 content",
    actions: (
      <div className="flex gap-3 justify-end">
        <Button variant={"contained"} color="success">Approve</Button>{" "}
        <Button variant={"contained"} color="error">Reject</Button>
      </div>
    ),
  },
  {
    name: "Offer 11",
    content: "Offer 11 content",
    actions: (
      <div className="flex gap-3 justify-end">
        <Button variant={"contained"} color="success">Approve</Button>{" "}
        <Button variant={"contained"} color="error">Reject</Button>
      </div>
    ),
  },
  {
    name: "Offer 12",
    content: "Offer 12 content",
    actions: (
      <div className="flex gap-3 justify-end">
        <Button variant={"contained"} color="success">Approve</Button>{" "}
        <Button variant={"contained"} color="error">Reject</Button>
      </div>
    ),
  },
  {
    name: "Offer 13",
    content: "Offer 13 content",
    actions: (
      <div className="flex gap-3 justify-end">
        <Button variant={"contained"} color="success">Approve</Button>{" "}
        <Button variant={"contained"} color="error">Reject</Button>
      </div>
    ),
  },
  {
    name: "Offer 14",
    content: "Offer 14 content",
    actions: (
      <div className="flex gap-3 justify-end">
        <Button variant={"contained"} color="success">Approve</Button>{" "}
        <Button variant={"contained"} color="error">Reject</Button>
      </div>
    ),
  },
  {
    name: "Offer 15",
    content: "Offer 15 content",
    actions: (
      <div className="flex gap-3 justify-end">
        <Button variant={"contained"} color="success">Approve</Button>{" "}
        <Button variant={"contained"} color="error">Reject</Button>
      </div>
    ),
  },
  {
    name: "Offer 16",
    content: "Offer 16 content",
    actions: (
      <div className="flex gap-3 justify-end">
        <Button variant={"contained"} color="success">Approve</Button>{" "}
        <Button variant={"contained"} color="error">Reject</Button>
      </div>
    ),
  },
  {
    name: "Offer 17",
    content: "Offer 17 content",
    actions: (
      <div className="flex gap-3 justify-end">
        <Button variant={"contained"} color="success">Approve</Button>{" "}
        <Button variant={"contained"} color="error">Reject</Button>
      </div>
    ),
  },
  {
    name: "Offer 18",
    content: "Offer 18 content",
    actions: (
      <div className="flex gap-3 justify-end">
        <Button variant={"contained"} color="success">Approve</Button>{" "}
        <Button variant={"contained"} color="error">Reject</Button>
      </div>
    ),
  },
  {
    name: "Offer 19",
    content: "Offer 19 content",
    actions: (
      <div className="flex gap-3 justify-end">
        <Button variant={"contained"} color="success">Approve</Button>{" "}
        <Button variant={"contained"} color="error">Reject</Button>
      </div>
    ),
  },
  {
    name: "Offer 20",
    content: "Offer 20 content",
    actions: (
      <div className="flex gap-3 justify-end">
        <Button variant={"contained"} color="success">Approve</Button>{" "}
        <Button variant={"contained"} color="error">Reject</Button>
      </div>
    ),
  },
];

const rowData = data.map((row) => {
  return createData(row.name, row.content, row.actions);
});

export default function OfferTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        borderRadius: "20px",
        boxShadow: "none",
        border: "1px solid #A7A7A7",
      }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{
                    minWidth: column.minWidth,
                    maxWidth: column.maxWidth,
                    fontWeight: "600",
                    fontSize: "18px",
                    lineHeight: "24px",
                    backgroundColor: "#F5F5F5",
                  }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rowData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rowData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
