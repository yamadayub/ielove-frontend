import { Step, Phase } from '../types';

const getPhaseForStep = (id: number): Phase => {
  if (id <= 20) return '計画';
  if (id <= 40) return '発注';
  if (id <= 60) return '設計';
  if (id <= 80) return '施工';
  return '完成・引き渡し';
};

export const steps: Step[] = [
  {
    id: 1,
    title: "家づくりって、何から始めればいいの？",
    titleImage: "https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg",
    detailImage: "https://images.pexels.com/photos/7319307/pexels-photo-7319307.jpeg",
    category: "計画",
    phase: "計画"
  },
  {
    id: 2,
    title: "理想の暮らしを考えよう",
    titleImage: "https://images.pexels.com/photos/4050318/pexels-photo-4050318.jpeg",
    detailImage: "https://images.pexels.com/photos/4050320/pexels-photo-4050320.jpeg",
    category: "計画",
    phase: "計画"
  },
  {
    id: 3,
    title: "家族の希望をまとめよう",
    titleImage: "https://images.pexels.com/photos/3933020/pexels-photo-3933020.jpeg",
    detailImage: "https://images.pexels.com/photos/4260482/pexels-photo-4260482.jpeg",
    category: "計画",
    phase: "計画"
  },
  {
    id: 4,
    title: "予算を考える",
    titleImage: "https://images.pexels.com/photos/4386158/pexels-photo-4386158.jpeg",
    detailImage: "https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg",
    category: "資金",
    phase: "計画"
  },
  {
    id: 5,
    title: "土地探しのポイント",
    titleImage: "https://images.pexels.com/photos/3953485/pexels-photo-3953485.jpeg",
    detailImage: "https://images.pexels.com/photos/8092430/pexels-photo-8092430.jpeg",
    category: "土地",
    phase: "計画"
  },
  {
    id: 6,
    title: "ハウスメーカーと工務店の違い",
    titleImage: "https://images.pexels.com/photos/4489749/pexels-photo-4489749.jpeg",
    detailImage: "https://images.pexels.com/photos/4489773/pexels-photo-4489773.jpeg",
    category: "業者選び",
    phase: "発注"
  },
  {
    id: 7,
    title: "住宅ローンの基礎知識",
    titleImage: "https://images.pexels.com/photos/4385430/pexels-photo-4385430.jpeg",
    detailImage: "https://images.pexels.com/photos/4386442/pexels-photo-4386442.jpeg",
    category: "資金",
    phase: "計画"
  },
  {
    id: 8,
    title: "間取りの基本を学ぼう",
    titleImage: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg",
    detailImage: "https://images.pexels.com/photos/5849560/pexels-photo-5849560.jpeg",
    category: "設計",
    phase: "設計"
  },
  {
    id: 9,
    title: "断熱と省エネの重要性",
    titleImage: "https://images.pexels.com/photos/4107420/pexels-photo-4107420.jpeg",
    detailImage: "https://images.pexels.com/photos/4107455/pexels-photo-4107455.jpeg",
    category: "設計",
    phase: "設計"
  },
  {
    id: 10,
    title: "モデルハウスの見学ポイント",
    titleImage: "https://images.pexels.com/photos/5998041/pexels-photo-5998041.jpeg",
    detailImage: "https://images.pexels.com/photos/7587887/pexels-photo-7587887.jpeg",
    category: "情報収集",
    phase: "発注"
  },
];

export const generateAllSteps = (): Step[] => {
  const allSteps: Step[] = [...steps];
  
  for (let i = 11; i <= 100; i++) {
    const baseStep = steps[(i - 1) % 10];
    allSteps.push({
      ...baseStep,
      id: i,
      title: `Step ${i}: ${baseStep.title}`,
      phase: getPhaseForStep(i)
    });
  }
  
  return allSteps;
};