import { reactive, computed } from 'vue'

// ─── 全局单例语言状态 ───────────────────────────────────────────
const state = reactive({ lang: 'en' })

// ─── 词条字典 ────────────────────────────────────────────────────
const messages = {
  en: {
    // ── NavBar ──────────────────────────────────────────────────
    navCompare:   'COMPARE',
    navGenerate:  'GENERATE',
    navAnalyze:   'ANALYZE',
    navMethod:    'METHOD',

    // ── ModelTrainingOverview ────────────────────────────────────
    row01Title:     'Model Training & Pattern Overview',
    methodPipeline: '1. METHODOLOGY PIPELINE',
    defaultSteps: [
      'Scene Image',
      'OvSGTR Scene Graph',
      'gSpan Frequent Subgraph Mining',
      'Pattern-count Featurization',
      'XGBoost Spatial Scoring',
      'TreeSHAP Contribution Analysis'
    ],
    trainingAssetsTag: 'TRAINING ASSETS',
    trainImages:   'Training Image Samples',
    trainFeatures: 'gSpan Extracted Features',
    cvRmse:        'Cross-Validation RMSE (CV RMSE):',
    cvR2:          'Cross-Validation R² (CV R²):',
    holdoutR2:     'Independent Test Set R² (Holdout R²):',
    fitShapTag:    'FIT & GLOBAL SHAP SUMMARY (DOUBLED SCATTER & IMPORTANCE BAR)',
    scatterPlot:   'Prediction Scatter Plot',
    shapRanking:   'SHAP Global Feature Importance (Top 20)',
    patternSection:'2. INFLUENTIAL SPATIAL PATTERNS',
    patternTip:    'Click a subgraph card to lock it and link to the right-side Evidence Chain for spatial defect analysis.',
    posTitle:      'Promoting Patterns (Top Positive by SHAP)',
    negTitle:      'Suppressing Patterns (Top Negative by SHAP)',
    support:       'Support',
    freq:          'Freq',
    closeModal:    'Click anywhere to close',

    // ── SingleCaseEvidenceChain ──────────────────────────────────
    row03Title:    'Case Optimization Evidence Chain',
    stageBefore:   'Before',
    stageBeforeSub:'Original & Defect Diagnosis',
    stagePlanned:  'Planned',
    stagePlannedSub:'Counterfactual Pattern Plan',
    stageObserved: 'Observed',
    stageObservedSub:'Post-optimization Comparison',
    imageViewTag:  'IMAGE VIEW & DETECTED BBOX',
    patternLockHint: 'Pattern Locked:',
    noPatternHint: 'Click a pattern card on the left to lock it and highlight related spatial elements.',
    shapWaterfall: 'SHAP WATERFALL (Model Decision & Feature Contribution)',
    sceneGraph:    'SCENE GRAPH',
    caseSelector:  'CASE SELECTOR',
    selectCase:    'Select a case to start analysis',
    loading:       'FETCHING CASE ASSETS...',
    sceneGraphTopology: 'SCENE GRAPH TOPOLOGY',
    cyTip:         'Drag nodes to adjust layout · Hover to view semantic relationship',
    spatialDiagnosticReport: 'SPATIAL DIAGNOSTIC REPORT',
    defectDiagnosis: 'Spatial Defect Diagnosis',
    plannedActions:  'Planned Actions & AIGC Prompts',
    observedOutcomes: 'Observed Outcomes & Assessment',
    plannedGain:     'Planned Gain:',
    actualGain:      'Actual Gain:',
    noReportData:    'No diagnostic report data available.',

    // ── GpsCaseSelector ──────────────────────────────────────────
    row02Title:      'GPS Case Directory',
    gpsSiteLegend:   'EXIF Geolocation sites in Fuxing Island',
    waterfront:      'Waterfront',
    publicSpace:     'Public Space',
    heritage:        'Heritage',
    temporary:       'Temporary',
    gpsType:         'Type:',

    // ── GeneratePage ──────────────────────────────────────────────
    pageSubtitle:    'AIGC Urban Design Assessment & Spatial Inference Platform',
    integrityAlert:  'Data Integrity Validation Alert (Missing Files Checked by sync script):'
  },

  zh: {
    // ── NavBar ──────────────────────────────────────────────────
    navCompare:   '对比',
    navGenerate:  '生成',
    navAnalyze:   '分析',
    navMethod:    '方法',

    // ── ModelTrainingOverview ────────────────────────────────────
    row01Title:     '模型训练与频繁模式总览',
    methodPipeline: '1. 空间推演方法链',
    defaultSteps: [
      '场景原图',
      'OvSGTR 场景结构',
      'gSpan 频繁子图挖掘',
      'Pattern-count 特征化',
      'XGBoost 空间评分',
      'TreeSHAP 贡献度分析'
    ],
    trainingAssetsTag: 'TRAINING ASSETS',
    trainImages:   '训练图像样本数',
    trainFeatures: 'gSpan 提取特征数',
    cvRmse:        '交叉验证均方根误差 (CV RMSE):',
    cvR2:          '交叉验证确定系数 (CV R²):',
    holdoutR2:     '独立测试集 R² (Holdout R²):',
    fitShapTag:    'FIT & GLOBAL SHAP SUMMARY (DOUBLED SCATTER & IMPORTANCE BAR)',
    scatterPlot:   '预测拟合散点图 (Scatter Plot)',
    shapRanking:   'SHAP 特征全局重要性排行 (Top 20)',
    patternSection:'2. 核心空间子图模式排行',
    patternTip:    '点击下方频繁子图卡片，可将其锁定，联动右侧"单图优化证据链"进行空间缺陷的高亮剖析。',
    posTitle:      '推动评分提升模式 (Top Positive by SHAP)',
    negTitle:      '拉低评分抑制模式 (Top Negative by SHAP)',
    support:       '支持度 (Support)',
    freq:          '子图频数 (Freq)',
    closeModal:    '点击任意空白处关闭弹窗',

    // ── SingleCaseEvidenceChain ──────────────────────────────────
    row03Title:    '单图空间设计评估与优化证据链',
    stageBefore:   'Before 优化前',
    stageBeforeSub:'原图及缺陷诊断',
    stagePlanned:  'Planned 计划优化',
    stagePlannedSub:'反事实模式计划',
    stageObserved: 'Observed 优化后',
    stageObservedSub:'实际成效对比',
    imageViewTag:  'IMAGE VIEW & DETECTED BBOX (空间检测与视觉重构)',
    patternLockHint: '已锁定模式:',
    noPatternHint: '点击左侧模式卡片锁定后，此处将高亮相关空间要素。',
    shapWaterfall: 'SHAP WATERFALL (模型打分决策及特征贡献瀑布图)',
    sceneGraph:    '场景图',
    caseSelector:  '案例选择',
    selectCase:    '请选择一个案例开始分析',
    loading:       '正在加载案例数据...',
    sceneGraphTopology: '场景语义关系图谱',
    cyTip:         '拖拽节点可调整布局 · 鼠标悬浮查看语义关系',
    spatialDiagnosticReport: 'SPATIAL DIAGNOSTIC REPORT (城市设计诊断及优化动作)',
    defectDiagnosis: '城市设计缺陷分析 (Spatial Defect Diagnosis)',
    plannedActions:  '空间优化方向与 AIGC 修改提示 (Planned Actions)',
    observedOutcomes: '实际成效对比与评估 (Observed Outcomes)',
    plannedGain:     '计划提升:',
    actualGain:      '实际提升:',
    noReportData:    '暂无诊断报告数据',

    // ── GpsCaseSelector ──────────────────────────────────────────
    row02Title:      'GPS 案例空间分类检索',
    gpsSiteLegend:   '复兴岛老旧厂房实测 EXIF 地理点位',
    waterfront:      '滨水空间',
    publicSpace:     '公共空间',
    heritage:        '景观/工业遗存',
    temporary:       '临时构筑',
    gpsType:         '类型:',

    // ── GeneratePage ──────────────────────────────────────────────
    pageSubtitle:    'AIGC 城市设计评估与推演大盘 · 科学回溯证据链演示平台',
    integrityAlert:  '数据完整性校验提示 (Missing Files Checked by sync script):'
  }
}

// ─── 公开 API ────────────────────────────────────────────────────
export function useLang() {
  const t = (key) => messages[state.lang][key] ?? messages['en'][key] ?? key

  const toggleLang = () => {
    state.lang = state.lang === 'en' ? 'zh' : 'en'
  }

  const setLang = (l) => {
    if (l === 'en' || l === 'zh') state.lang = l
  }

  const currentLang = computed(() => state.lang)

  return { t, toggleLang, setLang, currentLang, state }
}
