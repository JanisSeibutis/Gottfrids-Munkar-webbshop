/* Add light/dark theme toggle function */
export const toggleTheme = () => {
  document.querySelector('.theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode')
  })
}
