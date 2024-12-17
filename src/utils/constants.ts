// Constants for the application
export const REQUIRED_MATERIALS = [
  { id: 'flooring', name: '床材', type: '床材' },
  { id: 'wallpaper', name: '壁紙', type: '壁紙' },
  { id: 'ceiling', name: '天井', type: '天井' },
  { id: 'lighting', name: '照明', type: '照明' },
  { id: 'window', name: '窓', type: '窓' },
  { id: 'door', name: 'ドア', type: 'ドア' },
] as const;

export const DEFAULT_ROOM_NAMES = [
  'リビングダイニング',
  'キッチン',
  '主寝室',
  '玄関',
  '廊下',
  '洗面所',
  '風呂',
  'トイレ',
] as const;