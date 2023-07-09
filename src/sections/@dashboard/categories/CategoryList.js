import PropTypes from 'prop-types';
// @mui
import { Grid } from '@mui/material';
import CategoryCard from './CategoryCard';

// ----------------------------------------------------------------------

CategoryList.propTypes = {
  categories: PropTypes.array.isRequired,
};

export default function CategoryList({ categories, onUpdateClick, onDeleteClick, ...other }) {
  return (
    <Grid container spacing={3} {...other}>
      {categories.map((category) => (
        <Grid key={category._id} item xs={12} sm={6} md={3}>
          <CategoryCard category={category} onUpdateClick={onUpdateClick} onDeleteClick={onDeleteClick} />
        </Grid>
      ))}
    </Grid>
  );
}
