import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
// @mui
import {Button, Table, Stack, Typography, Card, TableContainer, TableBody, TableRow, TableCell } from '@mui/material';
// components

import { technovaServiceAPI } from '../api/ConfigAPI';
/*eslint-disable */
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { showLoading, closeLoading } from '../redux/slices/LoadingSlice';
import { setErrorValue } from '../redux/slices/ErrorSlice';
import Scrollbar from '../components/scrollbar/Scrollbar';
import UserListHead from '../sections/@dashboard/user/UserListHead';

import Iconify from '../components/iconify/Iconify';
import CreateTechnovaServiceModal from '../sections/@dashboard/technova-service/CreateTechnovaServiceModal';
import UpdateTechnovaServiceModal from '../sections/@dashboard/technova-service/UpdateTechnovaServiceModal';
import DeleteTechnovaServiceModal from '../sections/@dashboard/technova-service/DeleteTechnovaServiceModal';
import Page from '../enums/page'
import ActionDropdown from '../components/Dropdown/ActionDropdown';
import SearchBar from '../components/searchbar';
import ReactPaginate from 'react-paginate';

const TABLE_HEAD = [
  { id: 'title', label: 'Tiêu đề', alignRight: false },
  { id: 'action', label: 'Chỉnh sửa', alignRight: true}
];

// ----------------------------------------------------------------------
export default function TechnovaServicePage() {
  const token = useSelector(state => state.token.value)
  const loading = useSelector(state => state.loading.value)

  const dispatch = useDispatch()

  const [technovaServices, setTechnovaService] = useState([{}])
  
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const [showDeleteForm, setShowDeleteForm] = useState(false);

  const [clickedElement, setClickedElement] = useState(null);

  const [pageCount, setPageCount] = useState(null)

  const [activePage, setActivePage] = useState(1)
  
  const [searchTerm, setSearchTerm] = useState('')


  function handleCreateFormShow() {
    setShowCreateForm(true)
  }

  function handleCloseCreateFormShow() {
    setShowCreateForm(false);
  }

  function handleUpdateFormShow(technovaService) {
    setClickedElement(technovaService)
    setShowUpdateForm(true)
  }

  function handleCloseUpdateFormShow() {
    setShowUpdateForm(false)
  }

  function handleDeleteFormShow(technovaService) {
    setClickedElement(technovaService);
    setShowDeleteForm(true);
  }

  function handleCloseDeleteFormShow() {
    setShowDeleteForm(false)
  }

  const handlePageClick = (event) => {
    setActivePage(event.selected + 1);
  };  

  useEffect(() => {
    async function getTechnovaService() {
      dispatch(showLoading());
      try {
        const res = await technovaServiceAPI.getAll(`page=${activePage}&take=5&q=${searchTerm}`,token);
        setTechnovaService(res.data.data);
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
     getTechnovaService();
  }, [token, activePage, searchTerm]);

  async function handleOnSubmitCreate(data) {
    setShowCreateForm(false)
    dispatch(showLoading())
    try {
      const res = await technovaServiceAPI.create(data, token)
      const newTechnovaService = [...technovaServices]
      newTechnovaService.unshift(res.data)
      setTechnovaService(newTechnovaService)
    }
    catch (error) {
      if (axios.isAxiosError(error))
        dispatch(setErrorValue({errorMessage: error.response ? error.response.data.message : error.message, page: Page.CREATE_TECHNOVA_SERVICE}))
      else
        dispatch(setErrorValue({errorMessage: error.toString(), page: Page.CREATE_TECHNOVA_SERVICE}))
      setShowCreateForm(true)
    }
    finally {
      dispatch(closeLoading())
    }
  }

  async function handleOnSubmitUpdate(data) {
    setShowUpdateForm(false)
    try {
      data['id'] = clickedElement.id
      const resData = await technovaServiceAPI.update(data, token)
      const filterTechnovaService = technovaServices.filter((r) => r.id !== resData.data.id)
      const newTechnovaService = [resData.data, ...filterTechnovaService]
      setTechnovaService(newTechnovaService)
    }
    catch (error) {
      if (axios.isAxiosError(error))
      dispatch(setErrorValue({errorMessage: error.response ? error.response.data.message : error.message, page: Page.UPDATE_TECHNOVA_SERVICE}))
    else
      dispatch(setErrorValue({errorMessage: error.toString(), page: Page.CREATE_TECHNOVA_SERVICE}))
      setShowUpdateForm(true)
    }
  }

  async function handleOnSubmitDelete() {
    setShowDeleteForm(false)
    try {
      await technovaServiceAPI.delete(clickedElement.id, token)
      const newTechnovaService = technovaServices.filter((r) => r.id !== clickedElement.id)
      setTechnovaService(newTechnovaService)
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
      <title>Dịch vụ</title>
    </Helmet>

    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
      <Typography variant="h4" gutterBottom>
        Dịch vụ
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
              {technovaServices.map((row) => {
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

    <CreateTechnovaServiceModal
        isShow={showCreateForm}
        onSubmit={(data) => {
          handleOnSubmitCreate(data);
        }}
        onClose={() => handleCloseCreateFormShow()}
      />

    <UpdateTechnovaServiceModal
        isShow={showUpdateForm}
        activeTechnovaService={clickedElement}
        onSubmit={(data) => {
          handleOnSubmitUpdate(data);
        }}
        onClose={() => handleCloseUpdateFormShow()}
      />

    <DeleteTechnovaServiceModal
        isShow={showDeleteForm}
        activeTechnovaService={clickedElement}
        onSubmit={() => handleOnSubmitDelete()}
        onClose={() => handleCloseDeleteFormShow()}
      />
    </>
  )
}
