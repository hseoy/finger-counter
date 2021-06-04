/* eslint-disable jsx-a11y/media-has-caption */
import React, { createRef, useEffect, useState } from 'react';
import '@tensorflow/tfjs-backend-webgl';
import * as handpose from '@tensorflow-models/handpose';
import styled, { css } from 'styled-components';
import fp from 'fingerpose';
import { drawPoint } from './lib/canvasUtil';
import getUserMediaStream from './lib/getUserMediaStream';
import gestures, { getGestureFingerCount } from './lib/gestures';

const Layer = css`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const VideoLayer = styled('video')`
  ${Layer};
  transform: scaleX(-1);
`;

const CanvasLayer = styled('canvas')`
  ${Layer};
`;

const ResultLayer = styled('div')`
  ${Layer};
  font-size: 100px;
  text-align: right;
  padding: 20px 30px 0 0;
`;

const VideoContainer = styled('div')`
  width: 640px;
  height: 480px;
  position: relative;
`;

const App = () => {
  const [result, setResult] = useState('');
  const canvasRef = createRef();
  const videoRef = createRef();

  const config = {
    width: 640,
    height: 480,
    fps: 30,
  };

  const landmarkColors = {
    thumb: 'red',
    indexFinger: 'blue',
    middleFinger: 'yellow',
    ringFinger: 'green',
    pinky: 'pink',
    palmBase: 'white',
  };

  const gestureStrings = [
    'FINGER_0',
    'FINGER_1',
    'FINGER_2',
    'FINGER_3',
    'FINGER_4',
    'FINGER_5',
  ];

  const estimateHands = async (model, video, ctx, gestureEstimator) => {
    ctx.clearRect(0, 0, config.width, config.height);
    const predictions = await model.estimateHands(video, true);

    for (let i = 0; i < predictions.length; i += 1) {
      Object.keys(predictions[i].annotations).forEach(part => {
        predictions[i].annotations[part].forEach(point => {
          drawPoint(ctx, point[0], point[1], 3, landmarkColors[part]);
        });
      });

      const est = gestureEstimator.estimate(predictions[i].landmarks, 8.5);
      if (est.gestures.length > 0) {
        est.gestures.sort((a, b) => b.confidence - a.confidence);
        const res = est.gestures[0];
        setResult(gestureStrings[getGestureFingerCount(res.name)]);
      }
    }

    setTimeout(
      () => estimateHands(model, video, ctx, gestureEstimator),
      1000 / config.fps,
    );
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = config.width;
    canvas.height = config.height;

    const video = videoRef.current;
    video.width = config.width;
    video.height = config.height;

    getUserMediaStream(config.width, config.height, config.fps)
      .then(stream => {
        video.srcObject = stream;
        return new Promise(resolve => {
          video.onloadedmetadata = () => resolve();
        });
      })
      .then(() => {
        video.play();
        video.addEventListener('loadeddata', () => {
          handpose.load().then(model => {
            const canvasCtx = canvas.getContext('2d');
            const gestureEstimator = new fp.GestureEstimator(gestures);
            estimateHands(model, video, canvasCtx, gestureEstimator);
          });
        });
      });
  }, []);

  return (
    <VideoContainer>
      <VideoLayer ref={videoRef} id="poseVideo" />
      <CanvasLayer ref={canvasRef} id="poseCanvas" />
      <ResultLayer id="poseResult">{result}</ResultLayer>
    </VideoContainer>
  );
};

export default App;
