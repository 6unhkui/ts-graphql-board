# 1. Docker Hub에서 원하는 Node 버전 선택 
# (이 앱은 사용하는 라이브러리때문에 최신 버전이 필요하다.)
FROM node:14

# 2. 애플리케이션 코드를 넣어두는 애플리케이션 작업 디렉토리를 생성한다.
WORKDIR /usr/src/app

# 3. 앱 의존성 관리 파일 추가
# 가능한 경우(npm@5+) package.json과 package-lock.json을 모두 복사하기 위해 와일드카드를 사용
COPY package*.json ./
COPY yarn.lock ./

# 4. 의존성 설치
RUN npm install

# 5. Docker 이미지 안에 앱의 소스코드를 넣기 위해 COPY 명령어로 앱 소스 추가
COPY . .
# .env.production을 Docker 이미지 안에 .env 파일로 넣어줌
COPY .env.production .env

# 6. 애플리케이션 빌드
RUN npm run build

# 7. NODE_ENV 값을 프로덕션으로 설정한다.
ENV NODE_ENV production

# 8. 앱이 8080포트에 바인딩 되어 있으므로 EXPOSE 지시어를 사용해서 docker 데몬에 매핑
EXPOSE 8080

# 9. 런타임을 정의하는 CMD
# 앱을 실행하는 중요 명령를 정의한다. 
CMD [ "node", "dist/index.js" ]
# = node dist/index.js를 기본 npm start을 사용

# 10. 이 이미지를 사용할 사용자를 설정한다.
USER node