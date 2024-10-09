import { useState } from 'react';
import {
  IconButton,
  Box,
  Menu,
  MenuItem,
  Tooltip,
  styled,
  useTheme
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import ReactCountryFlag from 'react-country-flag';

const IconButtonWrapper = styled(IconButton)(
  ({ theme }) => `
  width: ${theme.spacing(4)};
  height: ${theme.spacing(4)};
  border-radius: ${theme.general.borderRadiusLg};
`
);

function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const currentLanguage = i18n.language;
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang); // Save language in local storage
    handleClose();
  };

  const flags = [
    { code: 'US', label: 'English', lang: 'en' },
    { code: 'ES', label: 'Spanish', lang: 'es' },
    { code: 'FR', label: 'French', lang: 'fr' },
    { code: 'CN', label: 'Chinese', lang: 'zh' },
    { code: 'PH', label: 'Tagalog', lang: 'tl' },
    { code: 'VN', label: 'Vietnamese', lang: 'vi' },
    { code: 'AE', label: 'Arabic', lang: 'ar' }
  ];

  return (
    <Box>
      <Tooltip arrow title={t('Language Switcher')}>
        <IconButtonWrapper
          color="secondary"
          onClick={handleClick}
          sx={{
            mx: 1,
            background: theme.palette.background.default,
            transition: `${theme.transitions.create(['background'])}`,
            color: theme.palette.text.primary,
            '&:hover': {
              background: theme.palette.background.paper
            }
          }}
        >
          {flags.map(
            ({ code, lang }) =>
              currentLanguage === lang && (
                <ReactCountryFlag
                  key={code} // Ensure unique key prop
                  countryCode={code}
                  svg
                  title={code}
                />
              )
          )}
        </IconButtonWrapper>
      </Tooltip>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {flags.map(({ code, label, lang }) => (
          <MenuItem
            key={lang} // Use lang as a unique key
            onClick={() => changeLanguage(lang)}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <ReactCountryFlag
              countryCode={code}
              svg
              style={{ width: '1.5em', height: '1.5em', marginRight: '10px' }}
            />
            {label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}

export default LanguageSwitcher;
