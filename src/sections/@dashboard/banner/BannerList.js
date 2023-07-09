import PropTypes from 'prop-types';
// @mui
import { Grid } from '@mui/material';
import BannerCard from './BannerCard';

// ----------------------------------------------------------------------

BannerList.propTypes = {
  banners: PropTypes.array.isRequired,
};

export default function BannerList({ banners, onUpdateClick, onDeleteClick, ...other }) {
  return (
    <Grid container spacing={3} {...other}>
      {banners?.map((banner) => (
        <Grid key={banner.id} item xs={12} sm={6} md={3}>
          <BannerCard banner={banner} onUpdateClick={onUpdateClick} onDeleteClick={onDeleteClick} />
        </Grid>
      ))}
    </Grid>
  );
}
