import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
// @mui
import {Button, Table, Stack, Typography, Card, TableContainer, TableBody, TableRow, TableCell } from '@mui/material';
// components

import { solutionAPI } from '../api/ConfigAPI';
/*eslint-disable */
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { showLoading, closeLoading } from '../redux/slices/LoadingSlice';
import { setErrorValue } from '../redux/slices/ErrorSlice';
import Scrollbar from '../components/scrollbar/Scrollbar';
import UserListHead from '../sections/@dashboard/user/UserListHead';

import Iconify from '../components/iconify/Iconify';
import UpdateSolutionModal from '../sections/@dashboard/solution/UpdateSolutionModal';
import CreateSolutionModal from '../sections/@dashboard/solution/CreateSolutionModal';
import DeleteSolutionModal from '../sections/@dashboard/solution/DeleteSolutionModal';
import Page from '../enums/page';
import ActionDropdown from '../components/Dropdown/ActionDropdown';
import SearchBar from '../components/searchbar';
import ReactPaginate from 'react-paginate';

const TABLE_HEAD = [
  { id: 'title', label: 'Tiêu đề', alignRight: false },
  { id: 'action', label: 'Chỉnh sửa', alignRight: true}
];

// ----------------------------------------------------------------------
export default function SolutionPage() {
  const token = useSelector(state => state.token.value)
  const dispatch = useDispatch()

  const [solutions, setSolution] = useState([{}])
  
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const [showDeleteForm, setShowDeleteForm] = useState(false);


  const [clickedElement, setClickedElement] = useState(null);

  const [searchTerm, setSearchTerm] = useState('')
  const [pageCount, setPageCount] = useState(0)

  const [activePage, setActivePage] = useState(1)

  const handlePageClick = (event) => {
    setActivePage(event.selected);
  };

  function handleCreateFormShow() {
    setShowCreateForm(true)
  }

  function handleCloseCreateFormShow() {
    setShowCreateForm(false);
  }

  function handleUpdateFormShow(solution) {
    setClickedElement(solution)
    setShowUpdateForm(true)
  }

  function handleCloseUpdateFormShow() {
    setShowUpdateForm(false)
  }

  function handleDeleteFormShow(solution) {
    setClickedElement(solution);
    setShowDeleteForm(true);
  }

  function handleCloseDeleteFormShow() {
    setShowDeleteForm(false)
  }

  useEffect(() => {
    async function getSolution() {
      dispatch(showLoading());
      try {
        const res = await solutionAPI.getAll(`page=${activePage}&q=${searchTerm}`, token);
        setSolution(res.data.data);
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
      getSolution();
  }, [token, activePage, searchTerm, dispatch]);

  async function handleOnSubmitCreate(data) {
    setShowCreateForm(false)
    dispatch(showLoading())
    try {
      const res = await solutionAPI.create(data, token)
      const newSolution = [...solutions]
      newSolution.unshift(res.data)
      setSolution(newSolution)
    }
    catch (error) {
      if (axios.isAxiosError(error))
        dispatch(setErrorValue({errorMessage: error.response ? error.response.data.message : error.message, page: Page.CREATE_SOLUTION}))
      else
        dispatch(setErrorValue({errorMessage: error.toString(), page: Page.CREATE_SOLUTION}))
      setShowCreateForm(true)
    }
    finally {
      dispatch(closeLoading())
    }
  }

  async function handleOnSubmitUpdate(data) {
    setShowUpdateForm(false)
    dispatch(showLoading())
    try {
      data['id'] = clickedElement.id
      const resData = await solutionAPI.update(data, token)
      const filterSolution = solutions.filter((r) => r.id !== resData.data.id)
      const newSolution = [resData.data, ...filterSolution]
      setSolution(newSolution)
    }
    catch (error) {
      if (axios.isAxiosError(error))
        dispatch(setErrorValue({errorMessage: error.response ? error.response.data.message : error.message, page: Page.UPDATE_PRODUCT}))
      else
        dispatch(setErrorValue({errorMessage: error.toString(), page: Page.UPDATE_PRODUCT}))
      setShowUpdateForm(true)
    }
    finally {
      dispatch(closeLoading())
    }
  }

  async function handleOnSubmitDelete() {
    setShowDeleteForm(false)
    dispatch(showLoading())
    try {
      await solutionAPI.delete(clickedElement.id, token)
      const newSolution = solutions.filter((r) => r.id !== clickedElement.id)
      setSolution(newSolution)
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
      <title> Giải pháp</title>
    </Helmet>

    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
      <Typography variant="h4" gutterBottom>
        Giải pháp
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
            <UserListHead
              headLabel={TABLE_HEAD}
            />
            <TableBody>
              {solutions.map((row) => {
                const { id, title, content} = row;
                // const selectedUser = selected.indexOf(name) !== -1;

                return (
                  <TableRow key={id}>

                    <TableCell align="left">{title}</TableCell>


                    <TableCell align="right">
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
                pageRangeDisplayed={5}
                pageCount={pageCount? pageCount: 0}
                previousLabel="<"
                renderOnZeroPageCount={null}

            />
        </TableContainer>
      </Scrollbar>
    </Card>

    <CreateSolutionModal
        isShow={showCreateForm}
        onSubmit={(data) => {
          handleOnSubmitCreate(data);
        }}
        onClose={() => handleCloseCreateFormShow()}
      />

    <UpdateSolutionModal
        isShow={showUpdateForm}
        activeSolution={clickedElement}
        onSubmit={(data) => {
          handleOnSubmitUpdate(data);
        }}
        onClose={() => handleCloseUpdateFormShow()}
      />

    <DeleteSolutionModal
        isShow={showDeleteForm}
        activeSolution={clickedElement}
        onSubmit={() => handleOnSubmitDelete()}
        onClose={() => handleCloseDeleteFormShow()}
      />
  </>
  );
}
