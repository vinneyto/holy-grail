async function start() {
  const render = () => {
    requestAnimationFrame(render);
  };

  render();
}

start();
