const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const openModalButton = document.querySelectorAll(".btn-open");
const closeModalButton = document.querySelectorAll(".btn-close");
// OPEN THE MODAL FUNCTION
openModalButton.forEach(button => {
    button.addEventListener("click", () => {
        // IDENTIFY CORRECT MODAL TO OPEN AND EXTRACT ID
        const modalId = button.dataset.target.split("-")[1];
        // USE EXTRACTED MODAL ID TO REMOVE HIDDEN CLASSES
        const modal = document.querySelector(`#modal-${modalId}`);
        modal.classList.remove("hidden");
        overlay.classList.remove("hidden");
    })
  })

  closeModalButton.forEach(button => {
    button.addEventListener("click", () => {
        const modalId = button.dataset.target.split("-")[1];
        const modal = document.querySelector(`#modal-${modalId}`);
        modal.classList.add("hidden");
        overlay.classList.add("hidden")
    })
  });

//   IF USER CLICKS ON OVERLAY, CLOSE MODAL
  overlay.addEventListener("click", () => {
    closeModal();
  });
  
  document.addEventListener("keydown", function (e) {
    // IF USER HITS THE ESCAPE KEY AND MODAL SHOULD BE HIDDEN, CLOSE MODAL
    if (e.key === "Escape" && modal.classList.contains("hidden")) {
      closeModal();
    }
  });
  
  
 //   LISTEN FOR SCROLL EVENT
window.addEventListener('scroll', function() {
      // CHECK FOR A MODAL THAT ISN'T HIDDEN
      const modal = document.querySelector('.modal:not(.hidden)');
      if (modal) {
        // RETRIEVE CURRENT SCROLL VERTICAL POSITION
        const scrollPosition = window.scrollY;
        // SET TOP OF MODAL PROPERTY TO SCROLL POSITION    
        modal.style.top = `${scrollPosition}%`;
    }
});

function closeModal() {
  // IDENTIFY THE MODAL AND OVERLAY THAT IS NOT HIDDEN
  const modal = document.querySelector(".modal:not(.hidden)");
  const overlay = document.querySelector(".overlay:not(.hidden)");
  // HIDE THE MODAL AND OVERLAY
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
}