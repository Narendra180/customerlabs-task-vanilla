const saveSegmentBtn = document.getElementsByClassName("save-segment-btn")[0];
const sidebar = document.getElementsByClassName("sidebar")[0];
const sidebarContent = document.getElementsByClassName("sidebar-content")[0];
const sidebarCotentHeaderBackBtn = document.getElementsByClassName("sidebar-content-header-back-button")[0];

saveSegmentBtn.addEventListener('click', () => {
  showSidebar();
})

// hide sidebar when clicked on empty area of sidebar.
sidebar.addEventListener('click', (e) => {
  hideSidebar();
});

sidebarContent.addEventListener('click', (e) => {
  e.stopPropagation();
})

sidebarCotentHeaderBackBtn.addEventListener('click', (e) => {
  hideSidebar();
})

function showSidebar() {
  sidebar.classList.add("sidebar-visible");
  sidebarContent.classList.add("sidebar-content-visible");
}

function hideSidebar() {
  sidebar.classList.remove("sidebar-visible");
  sidebarContent.classList.remove("sidebar-content-visible");
}