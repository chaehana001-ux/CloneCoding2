# TVING 콘텐츠 클론

HTML, CSS, JavaScript로 만든 티빙 콘텐츠 소개 데모입니다. 외부 런타임 패키지 없이 Node.js 22 이상에서 실행합니다.

```sh
npm run dev
```

http://localhost:5173 에서 확인합니다. 히어로 자동 재생·드래그·화살표, 추천 카드 순환, 콘텐츠 검색, 관심 목록, 찜하기와 20개 작품 랭킹을 제공합니다. 영상 재생 버튼은 티빙 공식 작품 페이지로 연결됩니다.

## 배포

```sh
npm run build
vercel
# 미리보기 검증 후 운영 배포
vercel --prod
```

`vercel.json`에서 Framework를 Other로, 빌드 명령을 `npm run build`, 출력 경로를 `dist`로 지정합니다. 실제 배포에는 Vercel 로그인이 필요합니다. `dist`에는 HTML, CSS, JavaScript와 이미지 파일만 포함됩니다.

## 검증

- `npm run check`: JavaScript 문법 검사
- `npm run build`: 정적 배포 파일 생성
- `npm run verify`: 로컬 서버(기본 5173)와 디버깅 포트 9222의 검증 전용 Chrome 필요. `VERIFY_URL`로 검증 주소를 바꿀 수 있습니다.

실제 회원 인증·영상 다운로드·스트리밍 API는 포함하지 않습니다. 찜과 관심 목록은 현재 브라우저에 저장됩니다. 콘텐츠와 이미지는 데모용이며, 공식 서비스와 연결된 사이트가 아닙니다.
