// 预设实验数据：低分场景06、中分场景17、高分场景28
// 包含 EGTR 与 OvSGTR 双模型对应的指标、提示词、SHAP 贡献度及场景图拓扑节点

export const experimentScenarios = [
  {
    id: 'scenario_06',
    name: '低分场景 06 (低活力工业街区)',
    manualGrade: 1,
    desc: '沿街立面连续性差，步行带被机动车道或障碍物阻断，首层界面无活力，缺乏公共绿化过渡。',
    // 实体增减变化（共享或主要以EGTR为准，展示在面板中）
    objectsDelta: [
      { name: '人行道 (sidewalk)', value: 11, unit: '个', type: 'add', desc: '铺装和步行面积显著增加' },
      { name: '行人 (man)', value: 10, unit: '个', type: 'add', desc: '街道活跃人口提升' },
      { name: '门 (door)', value: 2, unit: '个', type: 'add', desc: '首层界面开口增多，通达度提升' },
      { name: '建筑 (building)', value: 1, unit: '个', type: 'add', desc: '体量微调' },
      { name: '窗户 (window)', value: -8, unit: '个', type: 'remove', desc: '杂乱窗户精简' },
      { name: '女人 (woman)', value: -6, unit: '个', type: 'remove', desc: '局部构图调整' }
    ],
    // 局部优化 AIGC 提示词
    prompts: {
      source: 'E:\\X-实验室工作\\2026AI4Cities\\work2\\small_sample_set\\code\\image2_prompt_template.txt',
      positive: '严格图生图。保留原图的相机视角、透视、尺寸、道路走向、建筑位置、地平线、主要人物和车辆、天气与光照，让前后明确是同一场景。只允许针对原始 waterfall 中的负向模式做局部、物理合理的城市设计调整。优化目标：减少或修复 building - street - car：完善树木与绿化的连续边界，保证根区、步行带和道路之间互不阻断。；减少或修复 building - sign - pole：整理沿街首层界面和出入口，保持建筑边界连续并提升可见性。；减少或修复 car - street - pole：完善树木与绿化的连续边界，保证根区、步行带和道路之间互不阻断。',
      negative: '禁止重建为另一条道路、广场或街区，禁止替换主要建筑，禁止改变镜头位置，不添加文字、标识、水印或示意图。保持真实街景摄影风格。',
      retain: 'window、建筑、woman、jacket、man'
    },
    // 模型推理对比数据
    models: {
      EGTR: {
        beforeScore: 2.30,
        afterScore: 3.68,
        delta: 1.38,
        status: 'success',
        // SHAP模式贡献值数据
        shapData: [
          { pattern: '建筑 - 街道 - 车辆 (链式)', value: 0.72, type: 'positive', desc: '街道连续边界完善，建筑与车道关系更趋合理' },
          { pattern: '建筑 - 招牌 - 立柱 (链式)', value: 0.45, type: 'positive', desc: '首层界面整理，消除了视觉杂乱杂项' },
          { pattern: '车辆 - 街道 - 树木 (链式)', value: 0.35, type: 'positive', desc: '绿化隔离带连续性增强' },
          { pattern: '车辆 - 街道 - 行人 (链式)', value: -0.14, type: 'negative', desc: '局部依然存在人车混行视线干扰' }
        ],
        // 场景图拓扑数据 (原图 vs 优化图)
        sceneGraph: {
          before: {
            nodes: [
              { id: 1, label: 'building', x: 20, y: 30, size: 25 },
              { id: 2, label: 'street', x: 50, y: 75, size: 20 },
              { id: 3, label: 'car', x: 80, y: 70, size: 15 },
              { id: 4, label: 'pole', x: 15, y: 65, size: 12 },
              { id: 5, label: 'sign', x: 25, y: 45, size: 12 }
            ],
            links: [
              { source: 1, target: 2, label: 'next to' },
              { source: 3, target: 2, label: 'on' },
              { source: 1, target: 5, label: 'has' },
              { source: 5, target: 4, label: 'on' },
              { source: 3, target: 4, label: 'near' }
            ]
          },
          after: {
            nodes: [
              { id: 1, label: 'building', x: 20, y: 30, size: 25 },
              { id: 2, label: 'street', x: 50, y: 75, size: 20 },
              { id: 3, label: 'car', x: 75, y: 75, size: 15 },
              { id: 6, label: 'sidewalk', x: 40, y: 60, size: 18 },
              { id: 7, label: 'tree', x: 42, y: 40, size: 15 },
              { id: 8, label: 'man', x: 60, y: 62, size: 12 }
            ],
            links: [
              { source: 1, target: 6, label: 'fronting' },
              { source: 6, target: 2, label: 'next to' },
              { source: 7, target: 6, label: 'on' },
              { source: 8, target: 6, label: 'walk on' },
              { source: 3, target: 2, label: 'on' }
            ]
          }
        }
      },
      OvSGTR: {
        beforeScore: 3.97,
        afterScore: 4.76,
        delta: 0.79,
        status: 'success',
        shapData: [
          { pattern: '绿化 - 人行道 - 行人 (链式)', value: 0.48, type: 'positive', desc: '绿化退让为人行道提供了良好步行环境' },
          { pattern: '建筑 - 人行道 - 门 (链式)', value: 0.32, type: 'positive', desc: '门与人行道通达度改善' },
          { pattern: '动物 - 人行道 - 雨伞 (链式)', value: -0.11, type: 'negative', desc: '零星非正式物体的侵占' }
        ],
        sceneGraph: {
          before: {
            nodes: [
              { id: 10, label: 'building', x: 20, y: 30, size: 25 },
              { id: 11, label: 'sidewalk', x: 45, y: 60, size: 18 },
              { id: 12, label: 'umbrella', x: 65, y: 55, size: 14 },
              { id: 13, label: 'dog', x: 50, y: 70, size: 10 }
            ],
            links: [
              { source: 10, target: 11, label: 'near' },
              { source: 12, target: 11, label: 'on' },
              { source: 13, target: 11, label: 'on' }
            ]
          },
          after: {
            nodes: [
              { id: 10, label: 'building', x: 20, y: 30, size: 25 },
              { id: 11, label: 'sidewalk', x: 45, y: 60, size: 18 },
              { id: 14, label: 'tree', x: 48, y: 40, size: 16 },
              { id: 15, label: 'person', x: 55, y: 58, size: 12 }
            ],
            links: [
              { source: 10, target: 11, label: 'fronting' },
              { source: 14, target: 11, label: 'along' },
              { source: 15, target: 11, label: 'walk on' }
            ]
          }
        }
      }
    }
  },
  {
    id: 'scenario_17',
    name: '中分场景 17 (混合功能过渡街区)',
    manualGrade: 3,
    desc: '沿街绿化较好但连续性不足，人车混行较为严重，且不同算法对于树木遮挡建筑立面的评价标准存在冲突。',
    objectsDelta: [
      { name: '街道 (street)', value: 16, unit: '个', type: 'add', desc: '机动车道划分清晰化' },
      { name: '行人 (man)', value: 10, unit: '个', type: 'add', desc: '过街人流增多' },
      { name: '车辆 (car)', value: 7, unit: '个', type: 'add', desc: '路边停车或行驶车辆增加' },
      { name: '建筑 (building)', value: 2, unit: '个', type: 'add', desc: '背景轮廓微调' },
      { name: '树木 (tree)', value: -9, unit: '棵', type: 'remove', desc: '修剪遮挡视线的茂密行道树' },
      { name: '人行道 (sidewalk)', value: -9, unit: '个', type: 'remove', desc: '铺装局部被划分为自行车道' }
    ],
    prompts: {
      source: 'E:\\X-实验室工作\\2026AI4Cities\\work2\\small_sample_set\\code\\image2_prompt_template.txt',
      positive: '严格图生图。保留原图的相机视角、透视、尺寸、道路走向、建筑位置、地平线、主要人物和车辆、天气与光照，让前后明确是同一场景。只允许针对原始 waterfall 中的负向模式做局部、物理合理的城市设计调整。优化目标：减少或修复 building - street - car：完善树木与绿化的连续边界，保证根区、步行带和道路之间互不阻断。；减少或修复 car - street - tree：完善树木与绿化的连续边界，保证根区、步行带和道路之间互不阻断。；减少或修复 car - street - car：完善树木与绿化的连续边界，保证根区、步行带和道路之间互不阻断。',
      negative: '禁止重建为另一条道路、广场或街区，禁止替换主要建筑，禁止改变镜头位置，不添加文字、标识、水印或示意图。保持真实街景摄影风格。',
      retain: '车辆、街道、人行道、wheel、树木'
    },
    models: {
      EGTR: {
        beforeScore: 2.72,
        afterScore: 3.56,
        delta: 0.84,
        status: 'success',
        shapData: [
          { pattern: '建筑 - 树木 - 行人 (链式)', value: 0.55, type: 'positive', desc: '修剪树枝后，建筑首层视线与行人的通达性提升' },
          { pattern: '建筑 - 街道 - 车辆 (链式)', value: 0.38, type: 'positive', desc: '路网优化减少了车道乱停现象' },
          { pattern: '建筑 - 树木 - 车辆 (链式)', value: -0.18, type: 'negative', desc: '树木与停靠车辆依然存在局部视线遮挡' }
        ],
        sceneGraph: {
          before: {
            nodes: [
              { id: 20, label: 'building', x: 20, y: 30, size: 25 },
              { id: 21, label: 'tree', x: 35, y: 45, size: 18 },
              { id: 22, label: 'car', x: 75, y: 70, size: 15 },
              { id: 23, label: 'street', x: 50, y: 75, size: 20 }
            ],
            links: [
              { source: 20, target: 21, label: 'behind' },
              { source: 21, target: 23, label: 'on' },
              { source: 22, target: 23, label: 'on' }
            ]
          },
          after: {
            nodes: [
              { id: 20, label: 'building', x: 20, y: 30, size: 25 },
              { id: 21, label: 'tree', x: 30, y: 40, size: 14 },
              { id: 24, label: 'man', x: 55, y: 65, size: 12 },
              { id: 22, label: 'car', x: 75, y: 70, size: 15 },
              { id: 23, label: 'street', x: 50, y: 75, size: 20 }
            ],
            links: [
              { source: 20, target: 21, label: 'next to' },
              { source: 24, target: 20, label: 'near' },
              { source: 22, target: 23, label: 'on' }
            ]
          }
        }
      },
      OvSGTR: {
        beforeScore: 4.20,
        afterScore: 3.62,
        delta: -0.58,
        status: 'fail',
        shapData: [
          { pattern: '绿化 - 街道 - 树木 (中心连接)', value: 0.28, type: 'positive', desc: '道路中心绿化隔离效果增强' },
          { pattern: '座椅 - 人行道 - 树木 (链式)', value: -0.42, type: 'negative', desc: '由于修剪过密树木，导致局部遮阴与休憩舒适度下降' },
          { pattern: '树木 - 人行道 - 车辆 (链式)', value: -0.34, type: 'negative', desc: '人行铺装缩减让位于非机动车/机动车道' }
        ],
        sceneGraph: {
          before: {
            nodes: [
              { id: 30, label: 'tree', x: 30, y: 40, size: 20 },
              { id: 31, label: 'sidewalk', x: 45, y: 65, size: 18 },
              { id: 32, label: 'chair', x: 50, y: 55, size: 12 },
              { id: 33, label: 'car', x: 80, y: 75, size: 15 }
            ],
            links: [
              { source: 30, target: 31, label: 'along' },
              { source: 32, target: 31, label: 'on' },
              { source: 32, target: 30, label: 'under' }
            ]
          },
          after: {
            nodes: [
              { id: 30, label: 'tree', x: 30, y: 40, size: 15 },
              { id: 31, label: 'sidewalk', x: 40, y: 65, size: 14 },
              { id: 33, label: 'car', x: 75, y: 75, size: 15 }
            ],
            links: [
              { source: 30, target: 31, label: 'along' },
              { source: 33, target: 31, label: 'near' }
            ]
          }
        }
      }
    }
  },
  {
    id: 'scenario_28',
    name: '高分场景 28 (高品质人文科创街区)',
    manualGrade: 5,
    desc: '空间尺度适宜，首层商业及科创活动界面活跃，优化重点在于消除建筑群之间的峡谷压迫感并增加街道家具。',
    objectsDelta: [
      { name: '行人 (man)', value: 11, unit: '个', type: 'add', desc: '多元社交活动增加' },
      { name: '建筑 (building)', value: 8, unit: '个', type: 'add', desc: '界面连续度微调' },
      { name: '座椅 (chair)', value: 4, unit: '个', type: 'add', desc: '新增便民休憩设施' },
      { name: '屋顶 (roof)', value: 4, unit: '个', type: 'add', desc: '露台及遮阳设施' },
      { name: '树木 (tree)', value: -25, unit: '棵', type: 'remove', desc: '大幅精简遮挡建筑立面的杂乱绿化' },
      { name: '街道 (street)', value: -13, unit: '个', type: 'remove', desc: '车道压缩，扩宽步行广场' }
    ],
    prompts: {
      source: 'E:\\X-实验室工作\\2026AI4Cities\\work2\\small_sample_set\\code\\image2_prompt_template.txt',
      positive: '严格图生图。保留原图的相机视角、透视、尺寸、道路走向、建筑位置、地平线、主要人物和车辆、天气与光照，让前后明确是同一场景。只允许针对原始 waterfall 中的负向模式做局部、物理合理的城市设计调整。优化目标：减少或修复 building - street - building：完善树木与绿化的连续边界，保证根区、步行带和道路之间互不阻断。；减少或修复 building - tree - sidewalk：完善树木与绿化的连续边界，保证根区、步行带和道路之间互不阻断。；减少或修复 building - street - tree：完善树木与绿化的连续边界，保证根区、步行带和道路之间互不阻断。',
      negative: '禁止重建为另一条道路、广场或街区，禁止替换主要建筑，禁止改变镜头位置，不添加文字、标识、水印或示意图。保持真实街景摄影风格。',
      retain: 'man、座椅、建筑、屋顶、pant'
    },
    models: {
      EGTR: {
        beforeScore: 5.68,
        afterScore: 6.50,
        delta: 0.82,
        status: 'success',
        shapData: [
          { pattern: '建筑 - 街道 - 建筑 (链式)', value: 0.68, type: 'positive', desc: '沿街立面连续性优化，消除了生硬的建筑断层' },
          { pattern: '座椅 - 树木 - 建筑 (链式)', value: -0.15, type: 'negative', desc: '座椅摆放位置与树木根区略微冲突' }
        ],
        sceneGraph: {
          before: {
            nodes: [
              { id: 40, label: 'building', x: 20, y: 30, size: 25 },
              { id: 41, label: 'building', x: 80, y: 30, size: 25 },
              { id: 42, label: 'street', x: 50, y: 75, size: 20 },
              { id: 43, label: 'tree', x: 35, y: 55, size: 15 }
            ],
            links: [
              { source: 40, target: 42, label: 'along' },
              { source: 41, target: 42, label: 'along' },
              { source: 43, target: 40, label: 'near' }
            ]
          },
          after: {
            nodes: [
              { id: 40, label: 'building', x: 20, y: 30, size: 25 },
              { id: 41, label: 'building', x: 80, y: 30, size: 25 },
              { id: 42, label: 'street', x: 50, y: 75, size: 20 },
              { id: 44, label: 'chair', x: 30, y: 60, size: 12 },
              { id: 45, label: 'man', x: 35, y: 65, size: 10 }
            ],
            links: [
              { source: 40, target: 42, label: 'along' },
              { source: 41, target: 42, label: 'along' },
              { source: 44, target: 40, label: 'in front of' },
              { source: 45, target: 44, label: 'sit on' }
            ]
          }
        }
      },
      OvSGTR: {
        beforeScore: 3.86,
        afterScore: 5.65,
        delta: 1.79,
        status: 'success',
        shapData: [
          { pattern: '车辆 - 街道 - 车辆 (链式)', value: 0.82, type: 'positive', desc: '机动车辆停靠边界规范化，释放了步行空间' },
          { pattern: '座椅 - 人行道 - 行人 (中心连接)', value: 0.65, type: 'positive', desc: '新增座椅显著提升了居民停留交往率' },
          { pattern: '车辆 - 绿化 - 树木 (链式)', value: -0.22, type: 'negative', desc: '局部车道尾气对行道树产生微观干扰' }
        ],
        sceneGraph: {
          before: {
            nodes: [
              { id: 50, label: 'car', x: 25, y: 70, size: 15 },
              { id: 51, label: 'street', x: 50, y: 75, size: 20 },
              { id: 52, label: 'car', x: 75, y: 70, size: 15 },
              { id: 53, label: 'sidewalk', x: 45, y: 60, size: 18 }
            ],
            links: [
              { source: 50, target: 51, label: 'on' },
              { source: 52, target: 51, label: 'on' },
              { source: 53, target: 51, label: 'next to' }
            ]
          },
          after: {
            nodes: [
              { id: 51, label: 'street', x: 50, y: 75, size: 20 },
              { id: 53, label: 'sidewalk', x: 40, y: 60, size: 18 },
              { id: 54, label: 'chair', x: 30, y: 55, size: 12 },
              { id: 55, label: 'person', x: 32, y: 50, size: 10 }
            ],
            links: [
              { source: 53, target: 51, label: 'next to' },
              { source: 54, target: 53, label: 'on' },
              { source: 55, target: 54, label: 'use' }
            ]
          }
        }
      }
    }
  }
]
