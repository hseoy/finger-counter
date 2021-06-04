import combinations from 'combinations';
import fp from 'fingerpose';

const fingers = fp.Finger.all;

const fingerCombo = combinations(fingers);

const fingerGestures = fingerCombo.map((combo, i) => {
  const fingerCount = combo.length;
  const gesture = new fp.GestureDescription(`finger_${fingerCount}_${i}`);
  combo.forEach(f => {
    gesture.addCurl(f, fp.FingerCurl.NoCurl, 1.0);
  });
  fingers.forEach(f => {
    if (!combo.includes(f)) {
      gesture.addCurl(f, fp.FingerCurl.FullCurl, 1.0);
      gesture.addCurl(f, fp.FingerCurl.HalfCurl, 0.6);
    }
  });
  return gesture;
});

const fingerZeroGesture = new fp.GestureDescription(
  `finger_0_${fingerGestures.length}`,
);
fingers.forEach(f => {
  fingerZeroGesture.addCurl(f, fp.FingerCurl.FullCurl, 1.0);
  fingerZeroGesture.addCurl(f, fp.FingerCurl.HalfCurl, 0.6);
});
fingerGestures.push(fingerZeroGesture);

export const getGestureFingerCount = gestureName => {
  return Number(gestureName[7]);
};

export default fingerGestures;
