---
title: Skill System
author: Seonghoon Kim
layout: post
category: Unity Portfolio
---

# Overview
![Skill System Overview]({{site.baseurl}}/assets/gifs/skillsystem_unity.gif)  

Category, Stat, Skill, Effect로 구성된 모듈식 스킬 시스템입니다. ScriptableObject를 활용하여 데이터를 관리하고, Editor 확장을 통해 직관적인 스킬 편집이 가능합니다.


##### Source Project : Project H - SkillSystem.cs
[![GitHub](https://img.shields.io/badge/GitHub-Project_H-blue?style=for-the-badge&logo=github)](https://github1s.com/hooony1324/Project_h/blob/HEAD/project_h/Assets/_Project/Scripts/IdentifiedObject/AbilitySystem/Skill/SkillSystem.cs)


---

# Skill Setting
![Skill Setting]({{site.baseurl}}/assets/images/skillsetting.png)

<details markdown="1" class="toggle-container">
<summary class="toggle-header">스킬 시스템 설정 상세</summary>

**기본 타입 설정**  
- Type
  - Active : 플레이어가 직접 사용하는 스킬
  - Passive : 자동으로 발동되는 스킬

- UseType
  - Instant : 즉시 발동되는 스킬
  - Toggle : 지속적으로 켜고 끌 수 있는 스킬

**실행 관련 설정**
- ExecutionType
  - Auto : 스킬의 지속시간, 주기 계산하여 자동 발동
  - Input : 키 입력 시 수동 발동

- ApplyType
  - Instant : 즉시 효과 적용
  - Animation : 애니메이션의 특정 시점에 효과 적용

**타겟팅 시스템 설정**  
- NeedSelectionResultType  
  - Target : 특정 타겟 선택 (적, 아군, 오브젝트)
  - Position : 위치나 방향 선택 (범위형 스킬)
- TargetSearchTimingOption  
  - TargetSelectionCompleted : 선택 즉시 타겟 확정 (고정 타겟)
  - Apply : 스킬 적용마다 타겟 재탐색 (동적 타겟)
</details>

# Skill Data
#### Preceding Action & Action
![SkillData Preceding Action & Action]({{site.baseurl}}/assets/images/skilldata_precedingaction.png)  

스킬은 Cast > Charge > Preceding Action > Action 순으로 진행됩니다. Preceding Action으로 사전 행동을, Action으로 실제 스킬 효과를 정의합니다.

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

#### Setting 
![SkillData Setting]({{site.baseurl}}/assets/images/skilldata_setting.png)  
스킬의 지속시간, 적용 횟수, 쿨타임을 설정합니다. 쿨타임은 스탯 시스템과 연동되어 감소 효과를 적용할 수 있습니다.

#### Target Searcher  
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

#### Cost & Cast & Charge
![SkillData Cost]({{site.baseurl}}/assets/images/skilldata_cost.png)  
스킬 사용에 필요한 자원을 설정합니다.

![SkillData Cast]({{site.baseurl}}/assets/images/skilldata_cast.png)  
스킬 시전 시간을 설정합니다.

![SkillData Charge]({{site.baseurl}}/assets/images/skilldata_charge.png)  
차징 관련 설정을 합니다. 총 차징 시간, 차지가 끝나는 시간, 최소 차징 시간, 차징 시작 시간 을 조정할 수 있습니다.

# Stat
![Stat 1]({{site.baseurl}}/assets/images/stat_1.png) 
체력, 쿨타임, 이동속도 등의 기본 수치를 정의합니다. 백분율/감소 여부를 설정하여 계산 방식을 결정합니다.

![Stat 2]({{site.baseurl}}/assets/images/stat_2.png)  
스탯 시스템을 통해 스킬의 쿨타임 감소와 같은 수치 보정이 가능합니다.

# Effect
#### Effect Setting
![Effect Setting]({{site.baseurl}}/assets/images/effect_setting.png)  
Category를 통해 효과를 분류하고, 중복 적용 규칙을 설정합니다.

#### Stack & Counter Effect
![Effect Stack]({{site.baseurl}}/assets/images/effect_stack.png)  
스택 시스템을 통해 누적 효과를 구현할 수 있습니다.

![Effect Counter Effect]({{site.baseurl}}/assets/images/effect_countereffect.png)  
특정 효과에 대한 면역 기능을 구현합니다. (예: 슈퍼아머의 넉백 면역)

#### Action
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

#### Setting & Custom Action
![Effect Setting & Custom Action]({{site.baseurl}}/assets/images/effect_setting_customaction.png)  
효과의 지속시간, 적용 횟수를 설정하고, 화면 떨림과 같은 부가 효과를 추가할 수 있습니다.