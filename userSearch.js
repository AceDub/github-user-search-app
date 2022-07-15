'use strict';
const fullName = document.querySelector('#name');
const username = document.querySelector('#username');
const joinedDate = document.querySelector('#user-joined');
const bio = document.querySelector('#user-bio');
const repos = document.querySelector('#repos');
const followers = document.querySelector('#followers');
const following = document.querySelector('#following');
const userLocation = document.querySelector('#location');
const blog = document.querySelector('#blog');
const twitter = document.querySelector('#twitter');
const company = document.querySelector('#company');
const userImage = document.querySelector('#user-image');
const searchInput = document.querySelector('#search-input');
const searchBar = document.querySelector('#search-bar');
const noResults = document.querySelector('#no-results');
const loader = document.querySelector('#loader');
const card = document.querySelector('#card');

const getUserData = (username) => {
  fetch(`https://api.github.com/users/${username}`)
    .then((res) => {
      noResults.hidden = true;
      if (res.status >= 200 && res.status <= 299) {
        return res.json();
      } else {
        throw Error(res.status);
      }
    })
    .then((data) => {
      userImage.src = '';
      updateUserData(data);
      loader.hidden = true;
      searchInput.value = '';
      card.style.display = 'flex';
    })
    .catch((err) => {
      if (err.message === '404') {
        noResults.hidden = false;
        loader.hidden = true;
      }
    });
};

function convertDate(date) {
  dayjs.extend(window.dayjs_plugin_customParseFormat);
  return dayjs(date).format('MMM-DD-YYYY').replaceAll('-', ' ');
}

function getClickableLink(link) {
  return link.startsWith('http://') || link.startsWith('https://')
    ? link
    : `http://${link}`;
}

function checkAvailability(element, value, link) {
  if (!value) {
    element.parentElement.classList.add('unavailable');
    return 'Not Available';
  } else {
    element.parentElement.classList.remove('unavailable');
    link ? (element.href = getClickableLink(link)) : '';
    return value;
  }
}

function updateUserData(data) {
  if (!data.name) {
    fullName.hidden = true;
    username.classList.add('large');
  } else {
    username.classList.remove('large');
    fullName.hidden = false;
    fullName.innerText = data.name;
  }
  if (!data.bio) {
    bio.innerText = 'This profile has no bio';
  } else {
    bio.innerText = data.bio;
  }
  username.innerText = `@${data.login}`;
  username.href = `https://github.com/${data.login}`;
  userImage.src = data.avatar_url;
  joinedDate.innerText = `Joined ${convertDate(data.created_at)}`;
  repos.innerText = data.public_repos;
  followers.innerText = data.followers;
  following.innerText = data.following;
  userLocation.innerText = checkAvailability(userLocation, data.location);
  blog.innerText = checkAvailability(blog, data.blog, `${data.blog}`);
  twitter.innerText = checkAvailability(
    twitter,
    data.twitter_username,
    `https://twitter.com/${data.twitter_username}`,
  );
  company.innerText = checkAvailability(company, data.company);
}

searchBar.addEventListener('submit', (event) => {
  event.preventDefault();
  loader.hidden = false;
  getUserData(searchInput.value);
});

searchInput.addEventListener('input', () => {
  if (noResults.hidden === false || searchInput.value === '') {
    noResults.hidden = true;
  }
});
