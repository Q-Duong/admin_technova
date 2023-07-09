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

const StyledProductImg = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
  product: PropTypes.object,
};

export default function ShopProductCard({ product, onUpdateClick, onDeleteClick, onDetailClick }) {

  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        {product.active && (
          <Label
            variant="filled"
            color={(product.active === 'sale' && 'error') || 'info'}
            sx={{
              zIndex: 9,
              top: 16,
              right: 16,
              position: 'absolute',
              textTransform: 'uppercase',
            }}
          >
            {product.active}
          </Label>
        )}
        <StyledProductImg alt={'mi'} src={`https://technova.com.vn/wp-content/uploads/2019/10/team.jpg`} />
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Link color="inherit" underline="hover" style={{ cursor: "pointer" }}>
            <Typography variant="subtitle2" noWrap>
              Microsoft Team
            </Typography>
          </Link>
          <ActionDropdown 
            clickedElement={product}
            onUpdateClick={onUpdateClick}
            onDeleteClick={onDeleteClick}
            onDetailClick={onDetailClick}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1">
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
