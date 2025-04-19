import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSugoroku } from '../hooks/useSugorokuContext';
import { UserNote, Step, StepGroup } from '../types';

type NoteWithDetails = {
  note: UserNote;
  step: Step;
  group: StepGroup;
};

export const NotesPage: React.FC = () => {
  const navigate = useNavigate();
  const { userNotes, steps, stepGroups, isLoading, error } = useSugoroku();
  
  const [notesWithDetails, setNotesWithDetails] = useState<NoteWithDetails[]>([]);
  const [filterGroupId, setFilterGroupId] = useState<number | null>(null);

  // メモとその関連情報を取得
  useEffect(() => {
    if (userNotes.length === 0 || steps.length === 0 || stepGroups.length === 0) return;
    
    const notesWithStepInfo = userNotes.map(note => {
      const step = steps.find(s => s.id === note.stepId);
      if (!step) return null;
      
      const group = stepGroups.find(g => g.id === step.groupId);
      if (!group) return null;
      
      return {
        note,
        step,
        group
      };
    }).filter((item): item is NoteWithDetails => item !== null);
    
    // 作成日の降順（新しい順）でソート
    notesWithStepInfo.sort((a, b) => 
      new Date(b.note.updatedAt).getTime() - new Date(a.note.updatedAt).getTime()
    );
    
    setNotesWithDetails(notesWithStepInfo);
  }, [userNotes, steps, stepGroups]);

  // ステップの詳細ページに移動
  const handleNoteClick = (stepId: number) => {
    navigate(`/step/${stepId}`);
  };

  // フィルター後のメモ
  const filteredNotes = filterGroupId 
    ? notesWithDetails.filter(item => item.group.id === filterGroupId)
    : notesWithDetails;

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 pb-14 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-16 pb-14 px-4 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-14 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mt-4 mb-6">メモ一覧</h1>
        
        {userNotes.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500">メモはまだありません</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              スゴロクを見る
            </button>
          </div>
        ) : (
          <>
            {/* グループフィルター */}
            <div className="mb-6 flex flex-wrap gap-2">
              <button
                className={`px-3 py-1 rounded-full text-sm ${
                  filterGroupId === null
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
                onClick={() => setFilterGroupId(null)}
              >
                すべて
              </button>
              
              {stepGroups.map(group => (
                <button
                  key={group.id}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filterGroupId === group.id
                      ? 'text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                  style={{ 
                    backgroundColor: filterGroupId === group.id ? group.color : undefined
                  }}
                  onClick={() => setFilterGroupId(group.id)}
                >
                  {group.name}
                </button>
              ))}
            </div>
            
            {/* メモリスト */}
            <div className="space-y-4">
              {filteredNotes.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  このフィルター条件に一致するメモはありません
                </p>
              ) : (
                filteredNotes.map(({ note, step, group }) => (
                  <div
                    key={note.stepId}
                    className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleNoteClick(step.id)}
                  >
                    <div
                      className="h-2"
                      style={{ backgroundColor: group.color }}
                    />
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-lg">{step.title}</h3>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                          ステップ {step.order}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{group.name}</p>
                      <p className="text-sm text-gray-800 whitespace-pre-wrap mb-2 line-clamp-3">
                        {note.content}
                      </p>
                      <p className="text-xs text-gray-500">
                        最終更新: {new Date(note.updatedAt).toLocaleString('ja-JP')}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}; 