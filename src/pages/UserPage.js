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
} from '@mui/material';
// components
import Scrollbar from '../components/scrollbar';
// sections
// mock
import { userAPI } from '../api/ConfigAPI';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { closeLoading, showLoading } from '../redux/slices/LoadingSlice';
import ReactPaginate from 'react-paginate'
import DeleteUserModal from '../sections/@dashboard/user/DeleteUserModal';
import ActionDropdown from '../components/Dropdown/ActionDropdown';
import SearchBar from '../components/searchbar';
import UserListHead from '../sections/@dashboard/user/UserListHead';

const TABLE_HEAD = [
  { id: 'ID', label: 'Mã định danh', alignRight: false },
  { id: 'name', label: 'Tên', alignRight: false },
  { id: 'phone', label: 'SDT', alignRight: false },
  { id: 'address', label: 'Địa chỉ', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'action', label: 'Chỉnh sửa', alignRight: false },
];


export default function UserPage() {
  const token = useSelector(state => state.token.value)

  const dispatch = useDispatch();

  const [users, setUsers] = useState([]);
  const [showDeleteForm, setShowDeleteForm] = useState(false)
  const [clickedElement, setClickedElement] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [pageCount, setPageCount] = useState(0)

  const [activePage, setActivePage] = useState(1)

  const handlePageClick = (event) => {
    setActivePage(event.selected);
  };

  const handleCloseDeleteFormShow = () => {
    setShowDeleteForm(false);
  }

  const handleShowDeleteShow = (user) => {
    setClickedElement(user);
    setShowDeleteForm(true);
  }


  useEffect(() => {
    async function getUsers() {
      dispatch(showLoading());
      try {
        const res = await userAPI.getAll(`page=${activePage}&q=${searchTerm}`,token);
        setUsers(res.data.data);
        setPageCount(res.data.meta.pageCount)
      } catch (error) {
        if (axios.isAxiosError(error))
          alert(error.response ? error.response.data.message : error.message);
        else 
          alert(error.toString());
      } finally {
        dispatch(closeLoading());
      }
    }
    if(token)
      getUsers();
  }, [token, activePage, searchTerm, dispatch]);

  async function handleOnSubmitDelete() {
    setShowDeleteForm(false)
    dispatch(showLoading())
    try {
      await userAPI.delete(clickedElement.id, token)
      const newUser = users.filter((r) => r.id !== clickedElement.id)
      setUsers(newUser)
    }
    catch (error) {
      if (axios.isAxiosError(error))
        alert(error.response ? error.response.data.message : error.message)
      else
        alert(error.toString())
    }
    finally {
      dispatch(closeLoading())
    }
  }

  return (
    <>
      <Helmet>
        <title> Khách hàng </title>
      </Helmet>

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" gutterBottom>
          Khách hàng 
        </Typography>
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
              <UserListHead
                headLabel={TABLE_HEAD}
              />
              <TableBody>
                {users.map((row) => {
                  const { id, name, phone, address, email } = row;
                  // const selectedUser = selected.indexOf(name) !== -1;

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

                      <TableCell align="left">{phone}</TableCell>

                      <TableCell align="left">{address}</TableCell>

                      <TableCell align="left">{email}</TableCell>
                      <TableCell align="left">
                        <ActionDropdown
                          clickedElement={row}
                          onDeleteClick={() => {
                            handleShowDeleteShow(row)
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
                pageRangeDisplayed={5}
                pageCount={pageCount? pageCount: 0}
                previousLabel="<"
                renderOnZeroPageCount={null}

            />
          </TableContainer>
          
        </Scrollbar>
      </Card>

      <DeleteUserModal
        isShow={showDeleteForm} 
        activeUser={clickedElement}
        onSubmit={() => handleOnSubmitDelete()}
        onClose={() => handleCloseDeleteFormShow()}
      />
    </>
  );
}
