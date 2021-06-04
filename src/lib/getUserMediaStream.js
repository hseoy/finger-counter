const getUserMediaStream = (width, height, fps) => {
  const constraints = {
    audio: false,
    video: {
      facingMode: 'user',
      width,
      height,
      frameRate: { max: fps },
    },
  };

  return navigator.mediaDevices.getUserMedia(constraints);
};

export default getUserMediaStream;
