import PropTypes from 'prop-types';
// @mui
import { Box, Card, Link, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
// utils
import { fCurrency } from '../../../utils/formatNumber';
// components
import Label from '../../../components/label';
import { ColorPreview } from '../../../components/color-utils';
import ActionDropdown from '../../../components/Dropdown/ActionDropdown';

// ----------------------------------------------------------------------

const StyledBrandImg = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

// ----------------------------------------------------------------------

BrandCard.propTypes = {
  brand: PropTypes.object,
};

export default function BrandCard({ brand, onUpdateClick, onDeleteClick }) {
  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        {brand.active && (
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
            {brand.active}
          </Label>
        )}
        <StyledBrandImg
          alt={brand.name}
          src={`${brand.image?.path}`}
        />
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Link color="inherit" underline="hover" style={{ cursor: 'pointer' }}>
            <Typography variant="subtitle2" noWrap>
              {brand.name}
            </Typography>
          </Link>
          <ActionDropdown clickedElement={brand} onUpdateClick={onUpdateClick} onDeleteClick={onDeleteClick} />
        </Stack>
      </Stack>
    </Card>
  );
}
