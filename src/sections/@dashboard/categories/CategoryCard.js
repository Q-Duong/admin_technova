import PropTypes from 'prop-types';
// @mui
import { Box, Card, Link, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
// utils
// components
import Label from '../../../components/label';
import ActionDropdown from '../../../components/Dropdown/ActionDropdown';
// ----------------------------------------------------------------------

const StyledCategoryImg = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

// ----------------------------------------------------------------------

CategoryCard.propTypes = {
  category: PropTypes.object,
};

export default function CategoryCard({ category, onUpdateClick, onDeleteClick }) {
  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        {category.active && (
          <Label
            variant="filled"

            sx={{
              zIndex: 9,
              top: 16,
              right: 16,
              position: 'absolute',
              textTransform: 'uppercase',
            }}
          >
            {category.active}
          </Label>
        )}
        <StyledCategoryImg
          alt={category.name}
          src={category.image?.path}
        />
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Link color="inherit" underline="hover" style={{ cursor: 'pointer' }}>
            <Typography variant="subtitle2" noWrap>
              {category.name}
            </Typography>
          </Link>
          <ActionDropdown clickedElement={category} onUpdateClick={onUpdateClick} onDeleteClick={onDeleteClick} />
        </Stack>
      </Stack>
    </Card>
  );
}
