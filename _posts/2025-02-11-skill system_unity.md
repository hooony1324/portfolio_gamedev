---
title: 스킬 시스템
author: Seonghoon Kim
layout: post
category: Unity Portfolio
mermaid: true
---

# Overview
[![GitHub](https://img.shields.io/badge/GitHub-Project_H-blue?style=for-the-badge&logo=github)](https://github1s.com/hooony1324/Project_h/blob/HEAD/project_h/Assets/_Project/Scripts/IdentifiedObject/AbilitySystem/Skill/SkillSystem.cs)
![Skill System Overview]({{site.baseurl}}/assets/gifs/skillsystem_unity.gif)  

복잡한 스킬들을 효과적으로 구현하기 위해 스킬 시스템을 공부하여 적용하였습니다.
모바일 게임에서의 필요한 부분은 따로 기능을 추가하며 그동안 추상적 이었던 스킬 작동 개념을 확인하고 확장이 용이한 시스템 설계에 대해 공부할 수 있었습니다.

# 시스템 개요

```mermaid
graph TD
    A[SkillSystem] --> B[Skill]
    B --> C[SkillData]
    C --> D[TargetSearcher]
    C --> E[EffectSelector]
    C --> F[SkillAction]
```
##### SkillSystem
- Entity가 보유한 스킬 관리
- 스킬 등록/해제 및 상태 변화 이펙트 처리

##### Skill
- 스킬 타입에 따른 적절한 StateMachine설정(Instant, Passive, Toggle)  
- 실제 스킬의 사용 및 상태 관리를 담당

##### SkillData
- 스킬의 모든 설정 담당

##### TargetSearcher
- 스킬의 타겟팅 시스템 담당, 타겟 검색 및 선택

##### EffectSelector
- 스킬이 사용할 효과들을 선택, 상대방에게 스킬이 적용될 때 Effect적용

##### SkillAction
- 스킬이 실행되는 로직을 담당
- 투사체 발사 Action, 돌진 Action, 즉시 적용 Action 등  


#### 스킬 사용 흐름
```mermaid
sequenceDiagram
    participant User as Entity
    participant SS as SkillSystem
    participant S as Skill
    participant TS as TargetSearcher
    participant SA as SkillAction
    participant E as Effect

    User->>+SS: 스킬 사용
    SS->>+S: 활성화
    S->>+TS: 타겟 검색
    TS-->>-S: 타겟 반환
    S->>+SA: 액션 실행
    SA->>+E: 효과 적용
```
스킬 버튼에 사용할 스킬ID를 등록하고 버튼을 누를 때마다 Use를 시도합니다. Skill System은 Cooltime과 같이 사용 가능한지의 여부를 체크하여 스킬을 사용합니다.

스킬이 사용되면 아래와 같은 흐름이 생기게 됩니다
- searcher
- 


#### State Machine

#### 애니메이션 연동


---



# 스킬 편집
## Skill Setting
![Skill Setting]({{site.baseurl}}/assets/images/skillsetting.png)
단발성 즉시 적용 스킬, 지속성 스킬, 주기적 효과 적용 스킬 등 다양한 스킬을 설정할 수 있습니다.  


##### runningFinishOption
- 스킬 종료 조건을 결정
-FinishWhenApplyCompleted: applyCount만큼 적용 완료되면 종료
-FinishWhenDurationEnded: 지속시간이 끝나면 종료  

##### duration
- 스킬의 지속 시간
- 0으로 설정하고 FinishWhenDurationEnded 옵션이면 무한 지속
- 예: 버프 스킬의 지속 시간  

##### applyCount
- 스킬 효과 적용 횟수
- 0으로 설정하면 무한 적용
- 예: 리븐 Q스킬의 3회 사용  

##### applyCycle
- 스킬 효과의 주기적 적용 간격
- 첫 적용은 즉시, 이후 설정된 주기마다 적용
- 예: 1초로 설정 시 즉시 한번 적용 후 1초마다 재적용  

##### cooldown
- 스킬 재사용 대기시간
- StatScaleFloat 타입으로 스탯에 따라 쿨타임 조절 가능  

## Skill Data
### Preceding Action & Action
![SkillData Preceding Action & Action]({{site.baseurl}}/assets/images/skilldata_precedingaction.png)  

Preceding Action으로 사전 행동을, Action으로 실제 스킬 효과를 정의합니다.

<details markdown="1" class="toggle-container">
<summary class="toggle-header">Action 종류</summary>

**Spawn Projectile Action**  
![Skill 2 projectile]({{site.baseurl}}/assets/images/skilldata_spawnprojectile.png)  
투사체를 발사하는 스킬입니다. Editor를 통해 투사체의 속성을 세부 조정할 수 있습니다.

**Charging Rush Action**  
![SkillData Charging Rush Action]({{site.baseurl}}/assets/images/skilldata_chargingrush.png)  
차징 후 돌진하는 스킬입니다. NavMesh 경계에 부딪히면 스턴 효과가 적용됩니다.

**Instant Apply Action**  
![SkillData Instant Apply Action]({{site.baseurl}}/assets/images/skilldata_instantapply.png)  
효과를 즉시 적용하는 기본 Action입니다.
</details>

### Setting 
![SkillData Setting]({{site.baseurl}}/assets/images/skilldata_setting.png)  
스킬의 지속시간, 적용 횟수, 쿨타임을 설정합니다. 쿨타임은 스탯 시스템과 연동되어 감소 효과를 적용할 수 있습니다.

### Target Searcher  
![SkillData Target Searcher]({{site.baseurl}}/assets/images/skilldata_targetsearcher.png)

**Selection Action**  
자신, 가까운 적, 특정 위치 등 스킬의 대상을 선택하는 방식을 정의합니다.

**Search Action**  
선택된 대상이나 위치를 기준으로 실제 효과를 적용할 대상을 검색합니다.

<details markdown="1" class="toggle-container">
<summary class="toggle-header">Target Searcher 예시</summary>

![SkillData Target Searcher Example]({{site.baseurl}}/assets/images/skilldata_targetsearcher_example.png)

**Select Position By Moving Direction**은 현재 Skill의 주인이 움직이고 있는 방향을 기준으로 잡습니다.  
Select된 결과로 Search를 시작하는데 **Search Box Area**는 설정한 영역에 적이 있는지 확인합니다.

결론은 움직이고 있는 방향에 2 * 5 크기의 Box Area를 펼쳐 영역 내부의 의 적에게 스킬을 적용하게 됩니다.

</details>

### Cost & Cast & Charge
![SkillData Cost]({{site.baseurl}}/assets/images/skilldata_cost.png)  
스킬 사용에 필요한 자원을 설정합니다.  
<br>

![SkillData Cast]({{site.baseurl}}/assets/images/skilldata_cast.png)  
스킬 시전 시간을 설정합니다.  
<br>

![SkillData Charge]({{site.baseurl}}/assets/images/skilldata_charge.png)  
차징 관련 설정을 합니다. 총 차징 시간, 차지가 끝나는 시간, 최소 차징 시간, 차징 시작 시간 을 조정할 수 있습니다.  

## Stat
![Stat 1]({{site.baseurl}}/assets/images/stat_1.png) 
체력, 쿨타임, 이동속도 등의 기본 수치를 정의합니다. 백분율/감소 여부를 설정하여 계산 방식을 결정합니다.  
<br>

![Stat 2]({{site.baseurl}}/assets/images/stat_2.png)  
스탯 시스템을 통해 스킬의 쿨타임 감소와 같은 수치 보정이 가능합니다.

## Effect
### Setting
![Effect Setting]({{site.baseurl}}/assets/images/effect_setting.png)  
Category를 통해 효과를 분류하고, 중복 적용 규칙을 설정합니다.

### Stack & Counter Effect
![Effect Stack]({{site.baseurl}}/assets/images/effect_stack.png)  
스택 시스템을 통해 누적 효과를 구현할 수 있습니다.  
<br>

![Effect Counter Effect]({{site.baseurl}}/assets/images/effect_countereffect.png)  
특정 효과에 대한 면역 기능을 구현합니다. (예: 슈퍼아머의 넉백 면역)

### Action
![Effect Action]({{site.baseurl}}/assets/images/effect_action.png)  
데미지, CC기, 스탯 증가 등 다양한 효과를 조합할 수 있습니다.

<details markdown="1" class="toggle-container">
<summary class="toggle-header">Effect Action 종류</summary>

**Stun Action**  
![Effect Action Stun]({{site.baseurl}}/assets/images/effect_action_stun.png)
기존 CC를 제거하고 스턴을 적용합니다.

**Knockback Action**  
![Effect Action Knockback]({{site.baseurl}}/assets/images/effect_action_knockback.png)
힘, 방향, 시간을 설정하여 넉백 효과를 구현합니다.

**Increase Stat Action**  
![Effect Action Increase Stat]({{site.baseurl}}/assets/images/effect_action_increasestat.png)
지정한 스탯의 수치를 증가시킵니다.
</details>

### Setting & Custom Action
![Effect Setting & Custom Action]({{site.baseurl}}/assets/images/effect_setting_customaction.png)  
효과의 지속시간, 적용 횟수를 설정하고, 화면 떨림과 같은 부가 효과를 추가할 수 있습니다.