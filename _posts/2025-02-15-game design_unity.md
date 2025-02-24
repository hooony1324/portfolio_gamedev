---
title: 컨텐츠 개발
author: Seonghoon Kim
layout: post
category: Unity Portfolio
---

# 아이템 시스템
![Item Drop]({{site.baseurl}}/assets/images/contents_itemdrop.png)  
몬스터 처치 시 일정 확률에 따라 아이템을 드롭하는 기능을 구현하였습니다.
드롭 테이블을 이용하여 드롭할 아이템 그룹과 확률을 설정할 수 있으며 드랍된 아이템을 획득 시 아이템 테이블을 통해 획득 효과를 적용합니다.

##### Scriptable Sheets
![Scriptable Sheets]({{site.baseurl}}/assets/images/gamedata_scriptablesheets.png)
Scriptable Sheets 에셋을 이용해 엑셀 데이터 형태의 데이터로 게임을 관리할 수 있도록 기능을 만들었습니다.  

## 아이템 테이블

##### 아이템 기본 정보 설정
![Item Table]({{site.baseurl}}/assets/images/gamedata_itemtable.png)
아이템의 ID를 관리하고, 중복 소환 가능 여부, 장착 아이템 여부를 관리하는 테이블 입니다. 게임이 다시 로드 될 때 아이템의 획득효과를 다시 적용하는 것으로 캐릭터 능력치가 복구됩니다.  
<br>

##### 아이템 획득 시 효과 설정
![Item Table Inspector]({{site.baseurl}}/assets/images/contents_itemdata.png)  
아이템의 Inspector에서는 아이템을 획득했을 시의 효과를 설정할 수 있습니다.
각 효과 별 필요한 값을 설정할 수 있도록 획득 Action마다 다른 설정값을 관리합니다.  

##### 획득 시 효과
- 조합용 스킬 선택 이벤트
- 스탯 증가
- 골드 획득
- 새로운 패시브 스킬 추가

## 드롭 테이블
##### 아이템 그룹 설정과 드롭 확률 설정
![Item Drop Table]({{site.baseurl}}/assets/images/gamedata_droptable.png)  
기획자의 요청에 따라 아이템들을 그룹화를 하여 그룹 내에서 Probability를 계산하여 소환하는 형태로 구현하였습니다. 그룹 내에서 1개의 아이템만 소환되며 Probability를 100으로 한 아이템은 무조건 소환됩니다.

예를 들어 1번 그룹 드롭 시, 10008아이템의 Probability를 100, 나머지 아이템의 Probability를 10으로 설정한 상황이라면, 10008아이템이 100% 소환되고 나머지 아이템은 1개가 소환 될 때까지 10% 확률로 소환됩니다.


# 스킬 합성
![Skill Select]({{site.baseurl}}/assets/images/contents_skillselect.png)  
특정 아이템의 획득 효과로 플레이어가 가지고 있는 스킬에 따라 여러 스킬을 조합할 수 있도록 테이블을 설계하고 기능을 구현하였습니다.
<br>

##### 조합 조건 스킬과 조합 가능한 스킬 설정
![Skill Fusion Table]({{site.baseurl}}/assets/images/gamedata_skillfusiondata.png)

Default(10001)스킬이 있고 조합할 수 있는 스킬이 A(100001), B(100002), C(100003)가 있을 때 아이템을 먹으면 스킬 선택창이 등장하게 되어 선택합니다.  

첫 번째 선택 으로 A/B/C 중 하나의 스킬로 변경, 두 번째 선택으로 AB/BC/AC스킬로 변경, 마지막으로 ABC스킬로 변경됩니다.



# 몬스터 AI
![Monster AI]({{site.baseurl}}/assets/images/monsterai_behaviortree.png)
Unity6의 Behavior를 이용하여 몬스터AI를 구현하였습니다.
Behavior에는 순찰, 추격, 스킬 사용이 있으며 각 행동노드와 필요한 Condition노드를 직접 구현하였습니다.



# 테스트 씬
![Test Scene]({{site.baseurl}}/assets/images/contents_testscene.png)
기획 테스트와 디버그를 위하여 별도의 씬을 구성하였습니다.

아이템을 획득하여 새로운 스킬 획득과 같이 테스트를 하기까지의 과정이 너무 긴 부분들을 모아 별도의 씬에서 빠르게 테스트 할 수 있도록 하였으며
테스트 가능한 부분은 다음과 같습니다.  

- 소환할 Entity의 Data
- 인게임 스킬 등록/해제
- 아이템 드랍 테스트
- 스탯 증가 확인
