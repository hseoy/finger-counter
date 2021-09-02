# Finger Counter

This website will count your fingers

TensorFlow.js의 handpose model 기반인 [handpose](https://www.npmjs.com/package/fingerpose) 패키지를 사용해서 손가락의 개수를 카운팅하는 샘플 앱입니다.

손가락의 개수를 통해서 웹의 페이지를 이동시키는 인터페이스를 테스트하기 위해서 구현했습니다. 원래는 OpenCV.js를 사용해서 직접 손가락 개수 카운팅을 구현했는 데 실험 환경이 아니라 일반 환경에서는 조명 등의 변수가 많아 정확도가 떨어져서 tensorflow.js 기반의 라이브러리를 사용하는 것으로 변경하였습니다.

그럼에도 불구하고 정확도가 높은 것은 아니라서 손가락의 개수를 통한 웹 인터페이스는 사용자에게 그리 좋은 경험을 줄 수 없을 것으로 판단했고 계획을 삭제했습니다.

사용 기술 : React, Styled Component, fingerpose

## 실행 사진

![실행사진](https://user-images.githubusercontent.com/75124422/131851792-60a477d4-d774-49e8-9e0e-059ce27e85fd.PNG)
