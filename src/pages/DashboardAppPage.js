import { Helmet } from 'react-helmet-async';
// @mui
import { Grid, Container } from '@mui/material';
import AppWebsiteVisits from '../sections/@dashboard/app/AppWebsiteVisits';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/loading/Loading';
import MONTHS from '../enums/months'
import revenue from '../_mock/revenue'
import { closeLoading, showLoading } from '../redux/slices/LoadingSlice';
import { statisticAPI } from '../api/ConfigAPI';
import axios from 'axios';
// components
// sections

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const { loading, token } = useSelector(state => {
    return {
      loading: state.loading.value,
      token: state.token.value
    }
  })
  const [myRevenue, setMyRevenue] = useState(revenue)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(showLoading());
    Promise.all([statisticAPI.getAll(token)])
      .then((results) => {
        console.log(results[0].data)
        const data = results[0].data
        const revenue = Object.values(data)
        setMyRevenue({ revenue});
      })
      .catch((error) => {
        if (axios.isAxiosError(error))
          alert((error.response ? error.response.data.message : error.message));
        else alert((error.toString()));
        navigate("/error")
      })
      .finally(() => {
        dispatch(closeLoading());
      })
  }, [dispatch, token, navigate])

  return (
    loading ?
      <Loading /> :
      <>
        <Helmet>
          <title> Tổng quát </title>
        </Helmet>

        <Container maxWidth="xl">

          <Grid container spacing={3}>

            <Grid item xs={12} md={12} lg={12}>
              <AppWebsiteVisits
                title="Doanh thu trong năm"
                // subheader="(+43%) than last year"
                chartLabels={Object.values(MONTHS)}
                chartData={[
                  {
                    name: 'Doanh thu',
                    type: 'column',
                    fill: 'solid',
                    data: myRevenue?.revenue,
                  },
                ]}
              />
            </Grid>
          </Grid>
        </Container>
      </>
  );
}
