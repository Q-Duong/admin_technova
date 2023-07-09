import PropTypes from 'prop-types';
// @mui
import { Box, Card, Link, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
// utils
// components
import Label from '../../../components/label';
import ActionDropdown from '../../../components/Dropdown/ActionDropdown';

// ----------------------------------------------------------------------

const StyledBannerImg = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

// ----------------------------------------------------------------------

BannerCard.propTypes = {
  banner: PropTypes.object,
};

export default function BannerCard({ banner, onUpdateClick, onDeleteClick }) {
  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        {banner.active && (
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
            {banner.active}
          </Label>
        )}
        <StyledBannerImg
          alt={banner.title}
          src={`${banner.image?.path}`}
        />
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Link color="inherit" underline="hover" style={{ cursor: 'pointer' }}>
            <Typography variant="subtitle2" noWrap>
              Tiêu đề: {banner.title}
            </Typography>
            <Typography variant="subtitle2" noWrap>
              Vị trí: {banner.collocate}
            </Typography>
          </Link>
          <ActionDropdown clickedElement={banner} onUpdateClick={onUpdateClick} onDeleteClick={onDeleteClick} />
        </Stack>
      </Stack>
    </Card>
  );
}
