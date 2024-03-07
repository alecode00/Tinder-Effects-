//Terminado con los console.log();
const DECISION_THRESHOLD = 70;
let isAnimating = false;
let pullDeltaX = 0;

function starDrag(event) {
  if (isAnimating) return;

  //get the firs article element
  const actualCard = event.target.closest("article");
  if (!actualCard) return;
  console.log(`Devolviendo la card en starDrag: ${actualCard}`);

  //get initial position of mouse or finger
  // console.log(event)
  const startX = event.pageX ?? event.touches[0].pageX;
  //console.log(startX);

  //listen the mouse and touch movements
  document.addEventListener("mousemove", onMove);
  document.addEventListener("mouseup", onEnd);

  document.addEventListener("touchmove", onMove, { passive: true });
  document.addEventListener("touchend", onEnd, { passive: true });
  function onMove(event) {
    console.log("Entre al mousemove");
    //current position of mouse or finger
    const currentX = event.pageX ?? event.touches[0].pageX;
    //distance between current and initial position
    pullDeltaX = currentX - startX;
    //No hay distancia recorrida
    if (pullDeltaX === 0) {
      return;
    }
    console.log(`El desplazamineto ha sido de: ${pullDeltaX}`);

    isAnimating = true;
    //get degrees for rotation
    const deg = pullDeltaX / 14;
    //Rotando la carta los grados y trasladandola los px que se necesiten
    actualCard.style.transform = `translateX(${pullDeltaX}px) rotate(${deg}deg)`;
    console.log(`Devolviendo la card en onMove: ${actualCard}`);

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
    console.log("Entre al mouseup");
    console.log(`Devolviendo la card en onEnd: ${actualCard}`);
    console.log(`Devolviendo pullDeltaX dentro de onEnd: `);
    console.log(pullDeltaX);

    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup", onEnd);

    document.removeEventListener("touchmove", onMove);
    document.removeEventListener("touchend", onEnd);

    /* pullDeltaX = 0;
    isAnimating = false;
    actualCard.style.transform = "none";
    actualCard.style.cursor = "grab"; */

    console.log(actualCard.style.transform);

    //Know if the user take a choice
    const decisionMade = Math.abs(pullDeltaX) >= DECISION_THRESHOLD;
    if (decisionMade) {
      console.log(`El pullDeltaX dentro de onEnd es: ${pullDeltaX}`);
      console.log("Ya tome mi decision");
      if (pullDeltaX > 0) {
        console.log("gire hacia la derecha");
        actualCard.classList.add("goRight");
      } else {
        console.log("gire hacia la izquierda");
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
      console.log(`El pullDeltaX dentro de onEnd es: ${pullDeltaX}`);
      console.log("Estoy pensando");
      actualCard.querySelectorAll(".choice").forEach((el) => {
        el.style.opacity = 0;
      });
      actualCard.classList.add("reset");
      actualCard.classList.remove("goRight", "goLeft");
      /* const res = actualCard.querySelector('.choice.like')
      res.style.opacity = 0;
      const rus = actualCard.querySelector('.choice.nope')
      rus.style.opacity = 0; */

    }
    actualCard.addEventListener("transitionend", () => {
      actualCard.removeAttribute("style");
      actualCard.classList.remove("reset");
      pullDeltaX = 0;
      isAnimating = false;
    });
  }
  //console.log(event);
}

addEventListener("mousedown", starDrag);
addEventListener("touchstart", starDrag, { passive: true });
