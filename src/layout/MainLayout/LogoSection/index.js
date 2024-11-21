import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

// material-ui
import { ButtonBase } from '@mui/material';

// project imports
import { MENU_OPEN } from 'store/actions';
<<<<<<< HEAD
import LogoImage from '../../../../src/assets/images/Elevate_Logo.png';
=======
import LogoImage from '../../../../src/assets/images/Elevate_logo.jpeg';
>>>>>>> c222cb9997f8b69953128b0985b94cf37e0d55e4

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = () => {
  const defaultId = useSelector((state) => state.customization.defaultId);
  const dispatch = useDispatch();
  return (
    <ButtonBase disableRipple onClick={() => dispatch({ type: MENU_OPEN, id: defaultId })} component={Link}>
      {/* <Logo /> */}
      <img
        src={LogoImage}
        alt="logo"
        style={{
          width: '150px',
          height: '58px'
        }}
      ></img>
    </ButtonBase>
  );
};

export default LogoSection;
