import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  TableBody,
  TableCell,
  Typography,
  TableContainer,
  TableRow,
  Button,
} from '@mui/material';
// components
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
// mock
import { employeeAPI } from '../api/ConfigAPI';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { closeLoading, showLoading } from '../redux/slices/LoadingSlice';
import ReactPaginate from 'react-paginate'
import { setErrorValue } from '../redux/slices/ErrorSlice';
import Page from '../enums/page';
import CreateEmployeeModal from '../sections/@dashboard/employee/CreateEmployeeModal';
import UpdateEmployeeModal from '../sections/@dashboard/employee/UpdateEmployeeModal';
import DeleteEmployeeModal from '../sections/@dashboard/employee/DeleteEmployeeModal';
import EmployeeListHead from '../sections/@dashboard/employee/EmployeeListHead';
import ActionDropdown from '../components/Dropdown/ActionDropdown';
import SearchBar from '../components/searchbar';

const TABLE_HEAD = [
  { id: 'ID', label: 'Mã định danh', alignRight: false },
  { id: 'name', label: 'Tên', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'action', label: 'Chỉnh sửa', alignRight: false },
];


export default function EmployeePage() {
  const token = useSelector(state => state.token.value)

  const dispatch = useDispatch();

  const [employees, setEmployees] = useState([]);

  const [pageCount, setPageCount] = useState(0)

  const [activePage, setActivePage] = useState(1)

  const [showCreateForm, setShowCreateForm] = useState(false);

  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [clickedElement, setClickedElement] = useState(null);

  const [searchTerm, setSearchTerm] = useState('')


  const handlePageClick = (event) => {
    setActivePage(event.selected + 1);
  };

  function handleCreateFormShow() {
    setShowCreateForm(true)
  }

  function handleCloseCreateFormShow() {
    setShowCreateForm(false);
  }

  function handleUpdateFormShow(employee) {
    setClickedElement(employee)
    setShowUpdateForm(true)
  }

  function handleCloseUpdateFormShow() {
    setShowUpdateForm(false)
  }

  function handleDeleteFormShow(employee) {
    setClickedElement(employee);
    setShowDeleteForm(true);
  }

  function handleCloseDeleteFormShow() {
    setShowDeleteForm(false)
  }

  useEffect(() => {
    async function getEmployees() {
      try {
        const res = await employeeAPI.getAll(`page=${activePage}&take=5&q=${searchTerm}`,token);
        setEmployees(res.data.data);
        setPageCount(res.data.meta.pageCount)
      } catch (error) {
        if (axios.isAxiosError(error))
          alert(error.response ? error.response.data.message : error.message);
        else 
          alert(error.toString());
      }
    }
    if(token)
      getEmployees();
  }, [token, activePage, searchTerm]);



  async function handleOnSubmitCreate(data) {
    setShowCreateForm(false)
    try {
      const res = await employeeAPI.create(data, token)
      const newEmployee = [...employees]
      newEmployee.unshift(res.data)
      setEmployees(newEmployee)
    }
    catch (error) {
      if (axios.isAxiosError(error))
        dispatch(setErrorValue({errorMessage: error.response ? error.response.data.message : error.message, page: Page.CREATE_EMPLOYEE}))
      else
        dispatch(setErrorValue({errorMessage: error.toString(), page: Page.CREATE_EMPLOYEE}))
      setShowCreateForm(true)
    }
  }

  async function handleOnSubmitUpdate(data) {
    setShowUpdateForm(false)
    dispatch(showLoading())
    try {
      data['id'] = clickedElement.id
      const resData = await employeeAPI.update(data, token)
      const filterEmployee = employees.filter((r) => r.id !== resData.data.id)
      const newEmployee = [resData.data, ...filterEmployee]
      setEmployees(newEmployee)
    }
    catch (error) {
      if (axios.isAxiosError(error))
        dispatch(setErrorValue({errorMessage: error.response ? error.response.data.message : error.message, page: Page.UPDATE_EMPLOYEE}))
      else
        dispatch(setErrorValue({errorMessage: error.toString(), page: Page.UPDATE_EMPLOYEE}))
      setShowUpdateForm(true)
    }
    finally {
      dispatch(closeLoading())
    }
  }

  async function handleOnSubmitDelete() {
    setShowDeleteForm(false)
    try {
      await employeeAPI.delete(clickedElement.id, token)
      const newEmployee = employees.filter((r) => r.id !== clickedElement.id)
      setEmployees(newEmployee)
    }
    catch (error) {
      if (axios.isAxiosError(error))
        alert(error.response ? error.response.data.message : error.message)
      else
        alert(error.toString())
    }
  }

  return (
    <>
      <Helmet>
        <title> Nhân viên </title>
      </Helmet>

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" gutterBottom>
          Nhân viên
        </Typography>
        <Button onClick={handleCreateFormShow} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              Tạo mới
            </Button>
      </Stack>

      <Card>
        <SearchBar 
          filterName={searchTerm}
          onFilterName={
            (e) => {setSearchTerm(e.target.value)}
          }
        />
        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <EmployeeListHead
                headLabel={TABLE_HEAD}
              />
              <TableBody>
                {employees.map((row) => {
                  const { id, name, email } = row;
                  // const selectedEmployee = selected.indexOf(name) !== -1;

                  return (
                    <TableRow key={id}>
                      <TableCell align="left">{id}</TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Typography variant="subtitle2" noWrap>
                            {name}
                          </Typography>
                        </Stack>
                      </TableCell>

                      <TableCell align="left">{email}</TableCell>
                      <TableCell align="left">
                        <ActionDropdown 
                          clickedElement={row}
                          onUpdateClick={() => {
                            handleUpdateFormShow(row)
                          }}
                          onDeleteClick={() => {
                            handleDeleteFormShow(row)
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <ReactPaginate
          className="pagination"
                breakLabel="..."
                nextLabel=">"
                onPageChange={handlePageClick}
                pageRangeDisplayed={2}
                pageCount={pageCount? pageCount: 0}
                previousLabel="<"
                renderOnZeroPageCount={null}
            />
          </TableContainer>
        </Scrollbar>
      </Card>

      <CreateEmployeeModal
        isShow={showCreateForm}
        onSubmit={(data) => {
          handleOnSubmitCreate(data);
        }}
        onClose={() => handleCloseCreateFormShow()}
      />

      <UpdateEmployeeModal
        isShow={showUpdateForm}
        activeEmployee={clickedElement}
        onSubmit={(data) => {
          handleOnSubmitUpdate(data);
        }}
        onClose={() => handleCloseUpdateFormShow()}
      />

      <DeleteEmployeeModal
        isShow={showDeleteForm}
        activeEmployee={clickedElement}
        onSubmit={() => handleOnSubmitDelete()}
        onClose={() => handleCloseDeleteFormShow()}
      />
    </>
  );
}
