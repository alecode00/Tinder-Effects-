const DECISION_THRESHOLD = 70;
let isAnimating = false;
let pullDeltaX = 0;

function starDrag(event) {
  if (isAnimating) return;

  //get the firs article element
  const actualCard = event.target.closest("article");
  if (!actualCard) return;

  //get initial position of mouse or finger
  const startX = event.pageX ?? event.touches[0].pageX;
  //listen the mouse and touch movements
  document.addEventListener("mousemove", onMove);
  document.addEventListener("mouseup", onEnd);

  document.addEventListener("touchmove", onMove, { passive: true });
  document.addEventListener("touchend", onEnd, { passive: true });
  function onMove(event) {
    //current position of mouse or finger
    const currentX = event.pageX ?? event.touches[0].pageX;
    //distance between current and initial position
    pullDeltaX = currentX - startX;
    //No hay distancia recorrida
    if (pullDeltaX === 0) {
      return;
    }

    isAnimating = true;
    //get degrees for rotation
    const deg = pullDeltaX / 14;
    //Rotando la carta los grados y trasladandola los px que se necesiten
    actualCard.style.transform = `translateX(${pullDeltaX}px) rotate(${deg}deg)`;

    //Modificando el cursor
    actualCard.style.cursor = "grabbing";
    const opacity = Math.abs(pullDeltaX) / 100;
    const isRigth = pullDeltaX > 0;
    const choiceEl = isRigth
      ? actualCard.querySelector(".choice.like")
      : actualCard.querySelector(".choice.nope");
    choiceEl.style.opacity = opacity;
  }
  function onEnd(event) {
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup", onEnd);

    document.removeEventListener("touchmove", onMove);
    document.removeEventListener("touchend", onEnd);
    //Know if the user take a choice
    const decisionMade = Math.abs(pullDeltaX) >= DECISION_THRESHOLD;
    if (decisionMade) {
      if (pullDeltaX > 0) {
        actualCard.classList.add("goRight");
      } else {
        actualCard.classList.add("goLeft");
      }
      actualCard.addEventListener(
        "transitionend",
        () => {
          actualCard.remove();
        },
        { once: true }
      );
    } else {
      actualCard.querySelectorAll(".choice").forEach((el) => {
        el.style.opacity = 0;
      });
      actualCard.classList.add("reset");
      actualCard.classList.remove("goRight", "goLeft");
    }
    actualCard.addEventListener("transitionend", () => {
      actualCard.removeAttribute("style");
      actualCard.classList.remove("reset");
      pullDeltaX = 0;
      isAnimating = false;
    });
  }
}

addEventListener("mousedown", starDrag);
addEventListener("touchstart", starDrag, { passive: true });
