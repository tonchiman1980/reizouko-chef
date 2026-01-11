
export interface Recipe {
  title: string;
  ingredients: string[];
  time: string;
  steps: string[];
  advice: string;
  portions: number;
}

export interface ImageFile {
  id: string;
  url: string;
  base64: string;
  mimeType: string;
}
