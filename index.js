'use strict';
document.documentElement.classList.remove('no-js');

const STORAGE_KEY = 'user-color-scheme';
const COLOR_MODE_KEY = '$color-mode';

const theme = document.querySelector('.theme');
const themeIcon = document.querySelector('.theme-icon');
const themeText = document.querySelector('.theme-text');

const getCSSCustomProp = (propKey) => {
  let response = getComputedStyle(document.documentElement).getPropertyValue(
    propKey,
  );

  if (response.length) {
    response = response.replace(/\"/g, '').trim();
  }

  return response;
};

const applySetting = (passedSetting) => {
  let currentSetting = passedSetting || localStorage.getItem(STORAGE_KEY);

  if (currentSetting) {
    document.documentElement.setAttribute(
      'data-user-color-scheme',
      currentSetting,
    );
    setButtonLabelAndStatus(currentSetting);
  } else {
    setButtonLabelAndStatus(getCSSCustomProp(COLOR_MODE_KEY));
  }
};

const setButtonLabelAndStatus = (currentSetting) => {
  themeText.innerText = `${currentSetting === 'dark' ? 'Light' : 'Dark'}`;
  currentSetting === 'dark'
    ? (themeIcon.style.content = `url('/../assets/icon-sun.svg')`)
    : (themeIcon.style.content = `url('/../assets/icon-moon.svg')`);
};

const toggleSetting = () => {
  let currentSetting = localStorage.getItem(STORAGE_KEY);

  switch (currentSetting) {
    case null:
      currentSetting =
        getCSSCustomProp(COLOR_MODE_KEY) === 'dark' ? 'light' : 'dark';
      break;
    case 'light':
      currentSetting = 'dark';
      break;
    case 'dark':
      currentSetting = 'light';
      break;
  }

  localStorage.setItem(STORAGE_KEY, currentSetting);

  return currentSetting;
};

theme.addEventListener('click', (e) => {
  e.preventDefault();

  applySetting(toggleSetting());
});
applySetting();
