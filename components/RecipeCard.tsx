
import React from 'react';
import { Clock, Users, Lightbulb, Utensils, RotateCcw } from 'lucide-react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onReset: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onReset }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl shadow-emerald-900/5 border border-emerald-100">
        <div className="p-8 pb-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-50 text-orange-600 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-orange-100">
            <Utensils size={14} />
            初心者にオススメのレシピ
          </div>
          <h2 className="text-3xl font-extrabold text-emerald-900 mb-4 leading-tight">
            {recipe.title}
          </h2>
          <div className="flex items-center justify-center gap-6 text-emerald-600 font-medium bg-emerald-50 py-3 rounded-2xl mx-4">
            <div className="flex items-center gap-2">
              <Users size={18} />
              <span>{recipe.portions}人前</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span>約{recipe.time}</span>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-10">
          {/* Ingredients */}
          <section>
            <h3 className="text-lg font-bold text-emerald-900 mb-4 flex items-center gap-2 border-b border-emerald-50 pb-2">
              <span className="w-1.5 h-6 bg-orange-500 rounded-full"></span>
              材料・調味料（分量）
            </h3>
            <div className="grid gap-2">
              {recipe.ingredients.map((ing, idx) => {
                const parts = ing.split(':');
                const name = parts[0];
                const amount = parts.slice(1).join(':');
                return (
                  <div key={idx} className="flex justify-between items-center px-4 py-3 bg-white border border-emerald-50 rounded-xl group hover:border-orange-100 transition-colors">
                    <span className="text-emerald-900 font-medium">{name}</span>
                    <span className="text-orange-600 font-bold bg-orange-50 px-3 py-1 rounded-lg text-sm">{amount || '適量'}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Steps */}
          <section>
            <h3 className="text-lg font-bold text-emerald-900 mb-6 flex items-center gap-2 border-b border-emerald-50 pb-2">
              <span className="w-1.5 h-6 bg-orange-500 rounded-full"></span>
              作り方の手順
            </h3>
            <div className="space-y-8">
              {recipe.steps.map((step, idx) => (
                <div key={idx} className="flex gap-4 relative">
                  {idx !== recipe.steps.length - 1 && (
                    <div className="absolute left-4 top-10 bottom-[-20px] w-0.5 bg-emerald-50"></div>
                  )}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-900 text-white flex items-center justify-center font-bold text-sm z-10">
                    {idx + 1}
                  </div>
                  <p className="text-slate-700 leading-relaxed pt-0.5 text-lg">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Advice */}
          <section className="bg-orange-50 rounded-3xl p-6 border border-orange-100">
            <h3 className="text-orange-900 font-bold mb-3 flex items-center gap-2">
              <Lightbulb className="text-orange-500" size={20} />
              シェフからのアドバイス
            </h3>
            <p className="text-orange-900/80 italic leading-relaxed font-medium">
              「{recipe.advice}」
            </p>
          </section>
        </div>
      </div>

      <button 
        onClick={onReset}
        className="w-full flex items-center justify-center gap-2 py-5 bg-emerald-900 text-white rounded-2xl font-bold shadow-lg shadow-emerald-900/20 active:scale-95 transition-all"
      >
        <RotateCcw size={20} />
        別のレシピを作る・撮り直す
      </button>
    </div>
  );
};

export default RecipeCard;
