# 전국 둘레 길 조회

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```


### json-server 실행 (port는 임의로 지정)

``` sh
json-server --watch db.json --port 3000
```

### records 필드명 조회
```sh
http://localhost:3000/fields
검색조건 , 컬럼명_gte=2000&컬럼명_lte=5000
?_page=2&_limit=2
?_sort=price
?컬럼명_ne=1 -> 1인 값 제외
?컬럼명_like=^f
```
``` sh
'https://www.pettravel.kr/api/detailSeqPart.do?partCode=PC02&contentNum=1',
json-sever db.json 사용
'http://localhost:3000/records?INSTT_NAME=경기도 부천시',
Encoding 인증
`http://api.data.go.kr/openapi/tn_pubr_public_stret_tursm_info_api?serviceKey=8SijyesKfn%2BCsFIvHOJH4vstiQDcX%2B3o%2BYNWRf0EcuSFhw%2FYGPVeIFyc%2BROSfhduIKsyBFSWQ2M4%2FHw8TTWIYQ%3D%3D`,
Decoding 인증
`http://api.data.go.kr/openapi/tn_pubr_public_stret_tursm_info_napi?serviceKey=8SijyesKfn+CsFIvHOJH4vstiQDcX+3o+YNWRf0EcuSFhw/YGPVeIFyc+ROSfhduIKsyBFSWQ2M4/Hw8TTWIYQ==`,
```
