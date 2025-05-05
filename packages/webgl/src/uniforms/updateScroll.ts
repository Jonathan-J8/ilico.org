import uniforms from './uniforms';

const updateScroll = () => {
	uniforms.uScroll.value.x = window.scrollX / (document.body.scrollWidth - window.innerWidth);
	uniforms.uScroll.value.y = window.scrollY / (document.body.scrollHeight - window.innerHeight);
};

export default updateScroll;
