import PropTypes from 'prop-types';
// @mui
import { Grid } from '@mui/material';
import BrandCard from './BrandCard';

// ----------------------------------------------------------------------

BrandList.propTypes = {
  brands: PropTypes.array.isRequired,
};

export default function BrandList({ brands, onUpdateClick, onDeleteClick, ...other }) {
  return (
    <Grid container spacing={3} {...other}>
      {brands?.map((brand) => (
        <Grid key={brand._id} item xs={12} sm={6} md={3}>
          <BrandCard brand={brand} onUpdateClick={onUpdateClick} onDeleteClick={onDeleteClick} />
        </Grid>
      ))}
    </Grid>
  );
}
