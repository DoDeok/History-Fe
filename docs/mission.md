
문제 생성 | OCR로 변환한 수업자료를 기반으로 문제 생성 | /makeCard/:DataId | AI | O
: 역사 세트에 대한 AI로 문제생성 AI는 제미나이 API 활용, 키는 env 활용

흐름도 확인 | ocr로 만든 역사 흐름도 확인 | /set/:CardId/flow | 전체 | X
: flow테이블에 있는 흐름 불러오기

문제 불러오기 | 세트의 문제들 불러오기 | /quiz/:CardId | 전체 | X
: 문제 불러오기

문제 풀기 | 생성된 문제 풀기 | /quiz/:CardId | 전체 | X
: 불러온문제 풀기

랭킹확인 | 문제별 랭킹 확인 | /rank/:CardId | 전체 | X
: 불러온 카드세트의 랭킹 불러오기