---
title: Map System
author: Seonghoon Kim
layout: post
category: Unity Portfolio
---

# Overview
![Map System Overview]({{site.baseurl}}/assets/gifs/randommapsystem_unity.gif)  

로그라이크 장르에서 사용되는 절차적 던전 생성을 고려하여 랜덤한 방 배치를 하는 시스템을 만들었고, 각 방에 대한 커스터마이징과 확장성이 용이하도록 설계하였습니다.

##### Source Project : Project H - Dungeon.cs
[![GitHub](https://img.shields.io/badge/GitHub-Project_H-blue?style=for-the-badge&logo=github)](https://github1s.com/hooony1324/Project_h/blob/HEAD/project_h/Assets/_Project/Scripts/Contents/Map/Dungeon/Dungeon.cs)

---


# 던전 자동 생성 시스템

## 랜덤 방 배치
- 방 설치하고 상, 하, 좌, 우 살펴보며 랜덤 선택하여 방 배치
- 배치 실패한 방은 후순위로 미룸


## 문 설치
- MST: Kruskal (쓴 이유)
-- 방 간에 Edge 생성 > Union-Find 알고리즘으로 사이클 여부 확인하며 Door설치
- Grid단위로 보면서 문 설치 가능한지 확인함

이유
- 모든 방을 최소한의 문으로 연결
- 불필요한 순환 경로 제거


