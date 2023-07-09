import { Helmet } from 'react-helmet-async';
import React, { useEffect, useState } from 'react';
// @mui
import {Button, Table, Stack, Typography, Card, TableContainer, TableBody, TableRow, TableCell } from '@mui/material';
// components

import { newsAPI } from '../api/ConfigAPI';
/*eslint-disable */
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setErrorValue } from '../redux/slices/ErrorSlice';
import Scrollbar from '../components/scrollbar/Scrollbar';
import UserListHead from '../sections/@dashboard/user/UserListHead';

import Iconify from '../components/iconify/Iconify';
import UpdateNewsModal from '../sections/@dashboard/news/UpdateNewsModal';
import CreateNewsModal from '../sections/@dashboard/news/CreateNewsModal';
import DeleteNewsModal from '../sections/@dashboard/news/DeleteNewsModal';
import Page from '../enums/page';
import ActionDropdown from '../components/Dropdown/ActionDropdown';
import SearchBar from '../components/searchbar';
import ReactPaginate from 'react-paginate';

const TABLE_HEAD = [
  { id: 'title', label: 'Tiêu đề', alignRight: false },
  { id: 'image', label: 'Hình ảnh', alignRight: false },
  { id: 'action', label: 'Chỉnh sửa', alignRight: true}
];

// ----------------------------------------------------------------------
export default function NewsPage() {
  const token = useSelector(state => state.token.value)

  const dispatch = useDispatch()


  const [newss, setNews] = useState([])
  
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const [showDeleteForm, setShowDeleteForm] = useState(false);

  const [pageCount, setPageCount] = useState(0)

  const [activePage, setActivePage] = useState(1)

  const [searchTerm, setSearchTerm] = useState('')

  const [clickedElement, setClickedElement] = useState(null);

  const handlePageClick = (event) => {
    setActivePage(event.selected + 1);
  };


  function handleCreateFormShow() {
    setShowCreateForm(true)
  }

  function handleCloseCreateFormShow() {
    setShowCreateForm(false);
  }

  function handleUpdateFormShow(news) {
    setClickedElement(news)
    setShowUpdateForm(true)
  }

  function handleCloseUpdateFormShow() {
    setShowUpdateForm(false)
  }

  function handleDeleteFormShow(news) {
    setClickedElement(news);
    setShowDeleteForm(true);
  }

  function handleCloseDeleteFormShow() {
    setShowDeleteForm(false)
  }

  useEffect(() => {
    async function getNews() {
      try {
        const res = await newsAPI.getAll(`page=${activePage}&take=5&q=${searchTerm}`,token);
        setNews(res.data.data);
        setPageCount(res.data.meta.pageCount)
      } catch (error) {
        if (axios.isAxiosError(error))
          alert(error.response ? error.response.data.message : error.message);
        else 
          alert(error.toString());
      } 
    }
    if(token)
      getNews();
  }, [token, activePage, searchTerm]);

  async function handleOnSubmitCreate(data) {
    setShowCreateForm(false)
    try {
      const res = await newsAPI.create(data, token)
      const newNews = [...newss]
      newNews.unshift(res.data)
      setNews(newNews)
    }
    catch (error) {
      if (axios.isAxiosError(error))
        dispatch(setErrorValue({errorMessage: error.response ? error.response.data.message : error.message, page: Page.CREATE_NEWS}))
      else
        dispatch(setErrorValue({errorMessage: error.toString(), page: Page.CREATE_NEWS}))
      setShowCreateForm(true)
    }
  }

  async function handleOnSubmitUpdate(data) {
    setShowUpdateForm(false)
    try {
      data['id'] = clickedElement.id
      const resData = await newsAPI.update(data, token)
      const filterNews = newss.filter((r) => r.id !== resData.data.id)
      const newNews = [resData.data, ...filterNews]
      setNews(newNews)
    }
    catch (error) {
      if (axios.isAxiosError(error))
        dispatch(setErrorValue({errorMessage: error.response ? error.response.data.message : error.message, page: Page.UPDATE_NEWS}))
      else
        dispatch(setErrorValue({errorMessage: error.toString(), page: Page.UPDATE_NEWS}))
      setShowUpdateForm(true)
    }
  }

  async function handleOnSubmitDelete() {
    setShowDeleteForm(false)
    try {
      await newsAPI.delete(clickedElement.id, token)
      const newNews = newss.filter((r) => r.id !== clickedElement.id)
      setNews(newNews)
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
      <title> Tin tức </title>
    </Helmet>

    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
      <Typography variant="h4" gutterBottom>
        Tin tức
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
              {newss.map((row) => {
                const { id, title, image} = row;
                return (
                  <TableRow key={id}>

                    <TableCell align="left">{title}</TableCell>
                    <TableCell align="left">
                      <img src={image?.path} alt={title} width={200} height={200}/>
                    </TableCell>

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
                pageRangeDisplayed={2}
                pageCount={pageCount? pageCount: 0}
                previousLabel="<"
                renderOnZeroPageCount={null}
            />
        </TableContainer>
      </Scrollbar>
    </Card>

    <CreateNewsModal
        isShow={showCreateForm}
        onSubmit={(data) => {
          handleOnSubmitCreate(data);
        }}
        onClose={() => handleCloseCreateFormShow()}
      />

    <UpdateNewsModal
        isShow={showUpdateForm}
        activeNews={clickedElement}
        onSubmit={(data) => {
          handleOnSubmitUpdate(data);
        }}
        onClose={() => handleCloseUpdateFormShow()}
      />

    <DeleteNewsModal
        isShow={showDeleteForm}
        activeNews={clickedElement}
        onSubmit={() => handleOnSubmitDelete()}
        onClose={() => handleCloseDeleteFormShow()}
      />
  </>
  );
}
