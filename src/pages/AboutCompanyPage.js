import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
// @mui
import {Button, Table, Stack, Typography, Card, TableContainer, TableBody, TableRow, TableCell} from '@mui/material';
// components

import { aboutCompanyAPI } from '../api/ConfigAPI';
/*eslint-disable */
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { showLoading, closeLoading } from '../redux/slices/LoadingSlice';
import { setErrorValue } from '../redux/slices/ErrorSlice';
import Scrollbar from '../components/scrollbar/Scrollbar';
import UserListHead from '../sections/@dashboard/user/UserListHead';

import Iconify from '../components/iconify/Iconify';
import CreateAboutCompanyModal from '../sections/@dashboard/about-company/CreateAboutCompanyModal';
import UpdateAboutCompanyModal from '../sections/@dashboard/about-company/UpdateAboutCompanyModal';
import DeleteAboutCompanyModal from '../sections/@dashboard/about-company/DeleteAboutCompanyModal';
import Page from '../enums/page'
import ActionDropdown from '../components/Dropdown/ActionDropdown';
import SearchBar from '../components/searchbar';
import ReactPaginate from 'react-paginate';

const TABLE_HEAD = [
  { id: 'title', label: 'Tiêu đề', alignRight: false },
  { id: 'action', label: 'Chỉnh sửa', alignRight: true}
];

// ----------------------------------------------------------------------
export default function AboutCompanyPage() {
  const token = useSelector(state => state.token.value)

  const dispatch = useDispatch()

  const [aboutCompany, setAboutCompany] = useState([])
  
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

  function handleUpdateFormShow(aboutCompany) {
    setClickedElement(aboutCompany)
    setShowUpdateForm(true)
  }

  function handleCloseUpdateFormShow() {
    setShowUpdateForm(false)
  }

  function handleDeleteFormShow(aboutCompany) {
    setClickedElement(aboutCompany);
    setShowDeleteForm(true);
  }

  function handleCloseDeleteFormShow() {
    setShowDeleteForm(false)
  }

  const handlePageClick = (event) => {
    setActivePage(event.selected + 1);
  };  

  useEffect(() => {
    async function getAboutCompany() {
      dispatch(showLoading());
      try {
        const res = await aboutCompanyAPI.getAll(`page=${activePage}&take=5&q=${searchTerm}`,token);
        setAboutCompany(res.data.data);
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
     getAboutCompany();
  }, [token, activePage, searchTerm]);

  async function handleOnSubmitCreate(data) {
    setShowCreateForm(false)
    dispatch(showLoading())
    try {
      const res = await aboutCompanyAPI.create(data, token)
      const newAboutCompany = [...aboutCompany]
      newAboutCompany.unshift(res.data)
      setAboutCompany(newAboutCompany)
    }
    catch (error) {
      if (axios.isAxiosError(error))
        dispatch(setErrorValue({errorMessage: error.response ? error.response.data.message : error.message, page: Page.CREATE_ABOUT_COMPANY}))
      else
        dispatch(setErrorValue({errorMessage: error.toString(), page: Page.CREATE_ABOUT_COMPANY}))
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
      const resData = await aboutCompanyAPI.update(data, token)
      const filterAboutCompany = aboutCompany.filter((r) => r.id !== resData.data.id)
      const newAboutCompany = [resData.data, ...filterAboutCompany]
      setAboutCompany(newAboutCompany)
    }
    catch (error) {
      if (axios.isAxiosError(error))
      dispatch(setErrorValue({errorMessage: error.response ? error.response.data.message : error.message, page: Page.UPDATE_ABOUT_COMPANY}))
    else
      dispatch(setErrorValue({errorMessage: error.toString(), page: Page.CREATE_ABOUT_COMPANY}))
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
      await aboutCompanyAPI.delete(clickedElement.id, token)
      const newAboutCompany = aboutCompany.filter((r) => r.id !== clickedElement.id)
      setAboutCompany(newAboutCompany)
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
      <title> Bài viết về công ty </title>
    </Helmet>

    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
      <Typography variant="h4" gutterBottom>
        Bài viết giới thiệu
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
              {aboutCompany.map((row) => {
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

    <CreateAboutCompanyModal
        isShow={showCreateForm}
        onSubmit={(data) => {
          handleOnSubmitCreate(data);
        }}
        onClose={() => handleCloseCreateFormShow()}
      />

    <UpdateAboutCompanyModal
        isShow={showUpdateForm}
        activeAboutCompany={clickedElement}
        onSubmit={(data) => {
          handleOnSubmitUpdate(data);
        }}
        onClose={() => handleCloseUpdateFormShow()}
      />

    <DeleteAboutCompanyModal
        isShow={showDeleteForm}
        activeAboutCompany={clickedElement}
        onSubmit={() => handleOnSubmitDelete()}
        onClose={() => handleCloseDeleteFormShow()}
      />
    </>
  )
}
