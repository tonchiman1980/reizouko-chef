
import React, { useState, useCallback } from 'react';
import { Camera, RefreshCw, ChefHat, Utensils, Clock, CheckCircle2, Lightbulb, Trash2, Plus, Users } from 'lucide-react';
import { ImageFile, Recipe } from './types';
import { generateRecipe } from './services/geminiService';
import PhotoUploader from './components/PhotoUploader';
import RecipeCard from './components/RecipeCard';
import LoadingScreen from './components/LoadingScreen';

const App: React.FC = () => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [portions, setPortions] = useState<number>(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImagesChange = useCallback((newImages: ImageFile[]) => {
    setImages(prev => [...prev, ...newImages]);
    setError(null);
  }, []);

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const handleGenerate = async () => {
    if (images.length === 0) {
      setError("冷蔵庫の写真を撮影または選択してください。");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await generateRecipe(images, portions);
      setRecipe(result);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError("レシピの生成中にエラーが発生しました。もう一度お試しください。");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetApp = () => {
    setRecipe(null);
    setImages([]);
    setError(null);
  };

  return (
    <div className="min-h-screen pb-12 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-emerald-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2" onClick={resetApp} style={{ cursor: 'pointer' }}>
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-200">
              <ChefHat size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-emerald-900 leading-tight tracking-tight">AI冷蔵庫シェフ</h1>
              <p className="text-[10px] text-emerald-600 font-medium uppercase tracking-wider text-left">Beginner Friendly AI</p>
            </div>
          </div>
          {recipe && (
            <button 
              onClick={resetApp}
              className="p-2 text-emerald-700 hover:bg-emerald-50 rounded-full transition-colors"
            >
              <RefreshCw size={20} />
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 pt-6">
        {loading && <LoadingScreen />}
        
        {!loading && !recipe && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Camera Step */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-emerald-100 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <Camera size={32} />
              </div>
              <h2 className="text-2xl font-bold text-emerald-900">冷蔵庫をのぞかせてください</h2>
              <p className="text-slate-600 leading-relaxed">
                お料理初心者の方でも作りやすいよう、分量を正確に計算します。まずは冷蔵庫の写真を撮りましょう。
              </p>
              
              <PhotoUploader onImagesSelected={handleImagesChange} />
            </div>

            {/* Portions Step */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-100 space-y-4">
              <div className="flex items-center gap-2 font-bold text-emerald-900">
                <Users size={20} className="text-orange-500" />
                <h3>何人分作りますか？</h3>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    onClick={() => setPortions(num)}
                    className={`py-3 rounded-xl font-bold transition-all border ${
                      portions === num 
                      ? "bg-orange-500 text-white border-orange-500 shadow-md scale-105" 
                      : "bg-white text-emerald-800 border-emerald-100 hover:border-orange-200"
                    }`}
                  >
                    {num}人前
                  </button>
                ))}
              </div>
            </div>

            {/* Previews */}
            {images.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="font-bold text-emerald-900 flex items-center gap-2">
                    <Utensils size={18} />
                    撮影した写真 ({images.length})
                  </h3>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {images.map((img) => (
                    <div key={img.id} className="relative aspect-square group">
                      <img 
                        src={img.url} 
                        className="w-full h-full object-cover rounded-2xl border-2 border-white shadow-sm ring-1 ring-emerald-100" 
                        alt="Fridge preview" 
                      />
                      <button
                        onClick={() => removeImage(img.id)}
                        className="absolute -top-2 -right-2 bg-white text-rose-500 p-1.5 rounded-full shadow-md border border-rose-100 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square rounded-2xl border-2 border-dashed border-emerald-200 bg-white flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-50 transition-all hover:border-emerald-400 text-emerald-400">
                    <Plus size={32} />
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      multiple 
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        files.forEach(file => {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const base64 = (event.target?.result as string).split(',')[1];
                            const url = URL.createObjectURL(file);
                            handleImagesChange([{
                              id: Math.random().toString(36).substr(2, 9),
                              url,
                              base64,
                              mimeType: file.type
                            }]);
                          };
                          reader.readAsDataURL(file);
                        });
                      }}
                    />
                  </label>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl flex items-center gap-3">
                <div className="w-8 h-8 bg-rose-200 rounded-full flex shrink-0 items-center justify-center font-bold">!</div>
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="fixed bottom-6 left-0 right-0 px-4 max-w-2xl mx-auto z-20">
              <button
                disabled={images.length === 0}
                onClick={handleGenerate}
                className={`w-full py-5 rounded-2xl font-bold text-lg shadow-xl transition-all active:scale-95 flex flex-col items-center justify-center ${
                  images.length > 0 
                  ? "bg-orange-500 text-white hover:bg-orange-600 shadow-orange-200" 
                  : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                }`}
              >
                <div className="flex items-center gap-2">
                  <ChefHat size={24} />
                  <span>レシピを生成（{portions}人前）</span>
                </div>
                <p className="text-[10px] font-normal opacity-80">分量を自動計算します</p>
              </button>
            </div>
            <div className="h-24"></div>
          </div>
        )}

        {recipe && !loading && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <RecipeCard recipe={recipe} onReset={resetApp} />
          </div>
        )}
      </main>

      <footer className="mt-auto py-8 text-center text-emerald-900/40 text-sm">
        <p>© 2024 AI Refrigerator Chef - Beginner's Kitchen</p>
      </footer>
    </div>
  );
};

export default App;
