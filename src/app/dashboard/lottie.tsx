import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Box } from '@mui/material';

export const HomeLottie = () => {
  return (
    <Box sx={{ width: 300, mx: 'auto' }}>
      <DotLottieReact src="/assets/homeforward.lottie" loop autoplay />
    </Box>
  );
};
