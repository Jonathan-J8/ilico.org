import uniforms from "./uniforms";

const updateScroll = () => {
  uniforms.uScroll.value.x =
    window.scrollX / (document.body.offsetWidth - window.innerWidth);
  uniforms.uScroll.value.y =
    window.scrollY / (document.body.offsetHeight - window.innerHeight);
};

export default updateScroll;
