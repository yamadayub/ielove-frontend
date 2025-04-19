import { Step, StepGroup, UserNote, UserProgress } from '../types';

export const mockStepGroups: StepGroup[] = [
  {
    id: 1,
    name: '計画フェーズ',
    description: '家づくりの基本計画を立てる段階です',
    color: '#FFC107',
    order: 1
  },
  {
    id: 2,
    name: '設計フェーズ',
    description: '家の設計を決定する段階です',
    color: '#4CAF50',
    order: 2
  },
  {
    id: 3,
    name: '施工フェーズ',
    description: '実際に建築が始まる段階です',
    color: '#2196F3',
    order: 3
  },
  {
    id: 4,
    name: '完成・引き渡しフェーズ',
    description: '完成して引き渡される段階です',
    color: '#9C27B0',
    order: 4
  },
];

// ダミー画像のURLを生成する関数
const getDummyImage = (stepId: number, index: number): string => {
  // 実際にアップロードされている画像ファイルがある場合はそれを使用
  const realImagePath = `/images/mock/step_${stepId}_${index}.jpg`;
  
  // カテゴリーを決定（実際の画像がない場合のフォールバック用）
  const category = stepId % 4 === 0 ? 'house' : 
                  stepId % 3 === 0 ? 'architecture' :
                  stepId % 2 === 0 ? 'interior' : 'renovation';
  
  // 既存のステップでは実際の画像パスを使用し、それ以外の場合はフォールバックパス
  return realImagePath;
};

export const mockSteps: Step[] = [
  // 計画フェーズのステップ (1-25)
  {
    id: 1,
    title: '家づくりの目的を明確にする',
    description: '家族との対話を通じて、新しい家に求めるものを明確にしましょう。家のスタイル、必要な部屋数、重視する機能などを具体的にリストアップすることが大切です。',
    images: [getDummyImage(1, 1), getDummyImage(1, 2)],
    groupId: 1,
    order: 1
  },
  {
    id: 2,
    title: '予算計画を立てる',
    description: '無理のない資金計画を立て、住宅ローンの事前審査を受けておきましょう。建築費だけでなく、土地代、諸経費、家具・家電の費用も考慮に入れることが重要です。',
    images: [getDummyImage(2, 1), getDummyImage(2, 2)],
    groupId: 1,
    order: 2
  },
  {
    id: 3,
    title: '土地探しを始める',
    description: '希望エリアでの土地情報を収集し、条件に合った土地を探しましょう。日当たり、周辺環境、交通アクセス、将来的な環境変化なども考慮して選ぶことが大切です。',
    images: [getDummyImage(3, 1), getDummyImage(3, 2)],
    groupId: 1,
    order: 3
  },
  {
    id: 4,
    title: 'ハウスメーカー・工務店の比較検討',
    description: '複数のハウスメーカーや工務店を訪問し、施工実績や得意分野、サポート体制を比較検討しましょう。モデルハウスの見学も重要です。',
    images: [getDummyImage(4, 1), getDummyImage(4, 2)],
    groupId: 1,
    order: 4
  },
  {
    id: 5,
    title: '土地の購入・契約',
    description: '気に入った土地が見つかったら、地盤調査や法的制限の確認を行い、問題がなければ購入契約を進めます。',
    images: [getDummyImage(5, 1), getDummyImage(5, 2)],
    groupId: 1,
    order: 5
  },
  // 他のステップは省略していますが、実際には以下の25件ずつを用意します

  // 設計フェーズのステップ (26-50)
  {
    id: 26,
    title: '間取りプランの作成',
    description: '家族の生活スタイルに合わせた間取りプランを作成します。動線計画や収納計画も重要なポイントです。',
    images: [getDummyImage(26, 1), getDummyImage(26, 2)],
    groupId: 2,
    order: 26
  },
  {
    id: 27,
    title: '外観デザインの検討',
    description: '住宅の外観デザインや使用する外装材を検討します。周辺環境との調和も考慮しましょう。',
    images: [getDummyImage(27, 1), getDummyImage(27, 2)],
    groupId: 2,
    order: 27
  },
  {
    id: 28,
    title: '内装材の選定',
    description: 'フローリングや壁紙、キッチンやバスルームの仕様など、内装材を選定します。',
    images: [getDummyImage(28, 1), getDummyImage(28, 2)],
    groupId: 2,
    order: 28
  },
  // 施工フェーズのステップ (51-75)
  {
    id: 51,
    title: '地鎮祭の実施',
    description: '工事の安全を祈願する地鎮祭を行います。家族や親戚も参加できる大切な儀式です。',
    images: [getDummyImage(51, 1), getDummyImage(51, 2)],
    groupId: 3,
    order: 51
  },
  {
    id: 52,
    title: '基礎工事の開始',
    description: '家の基礎となるコンクリート工事が始まります。地盤の状況に合わせた適切な工法が選ばれます。',
    images: [getDummyImage(52, 1), getDummyImage(52, 2)],
    groupId: 3,
    order: 52
  },
  {
    id: 53,
    title: '上棟式',
    description: '家の骨組みが完成し、棟上げを祝う式を行います。これから家が形になっていく重要な節目です。',
    images: [getDummyImage(53, 1), getDummyImage(53, 2)],
    groupId: 3,
    order: 53
  },
  // 完成・引き渡しフェーズのステップ (76-100)
  {
    id: 76,
    title: '最終確認と検査',
    description: '完成した家の最終確認と検査を行います。細部まで確認し、必要に応じて微調整を依頼します。',
    images: [getDummyImage(76, 1), getDummyImage(76, 2)],
    groupId: 4,
    order: 76
  },
  {
    id: 77,
    title: '引き渡し式',
    description: '建築会社から正式に家の引き渡しを受けます。鍵の受け取りや保証書の確認も行います。',
    images: [getDummyImage(77, 1), getDummyImage(77, 2)],
    groupId: 4,
    order: 77
  },
  {
    id: 100,
    title: '新生活のスタート',
    description: 'いよいよ新しい家での生活が始まります。家族との新たな思い出作りが始まる瞬間です。',
    images: [getDummyImage(100, 1), getDummyImage(100, 2)],
    groupId: 4,
    order: 100
  },
];

export const mockUserNotes: UserNote[] = [
  {
    stepId: 1,
    content: '家族と話し合って、子どもの成長に合わせた間取りにすることに決めた。南向きのリビングと各部屋に十分な収納スペースを確保したい。また、将来的に在宅勤務の可能性も考慮して、書斎スペースも検討している。',
    createdAt: '2023-11-01T10:30:00Z',
    updatedAt: '2023-11-01T10:30:00Z'
  },
  {
    stepId: 2,
    content: '予算は3500万円に設定。頭金は500万円準備する。月々の返済額は住宅ローン控除も考慮して10万円以内に収めたい。太陽光パネルの設置も検討中だが、コストと効果を比較検討する必要がある。',
    createdAt: '2023-11-05T14:20:00Z',
    updatedAt: '2023-11-06T09:15:00Z'
  },
  {
    stepId: 3,
    content: '複数の不動産会社を回って、駅から徒歩15分以内、南向き、60坪以上の条件で土地を探している。学区や周辺の公園なども重視したい。',
    createdAt: '2023-11-10T16:45:00Z',
    updatedAt: '2023-11-10T16:45:00Z'
  }
];

export const mockUserProgress: UserProgress = {
  userId: 'user123',
  completedSteps: [1, 2],
  currentStep: 3,
  lastUpdated: '2023-11-07T18:45:00Z'
}; 