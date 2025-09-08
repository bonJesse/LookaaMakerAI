import { GoogleGenAI, Type, Modality } from "@google/genai";

// Assume API_KEY is set in the environment
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

export const analyzeImage = async (base64Image: string, mimeType: string) => {
    const prompt = `分析提供的图像。它是否包含一张或多张清晰、高质量的人脸？人脸应该是主要拍摄对象。请仅使用以下结构响应JSON对象: {"isValid": boolean, "reason": string}。如果有效, reason应为'有效的肖像照片'。如果无效, 请提供简要原因, 例如'未检测到人脸', '图像太模糊', 或'脸部在画面中太小'。`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                { inlineData: { data: base64Image, mimeType: mimeType } },
                { text: prompt }
            ]
        },
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    isValid: { type: Type.BOOLEAN },
                    reason: { type: Type.STRING }
                },
                required: ['isValid', 'reason']
            }
        }
    });

    const jsonText = response.text.trim();
    try {
        return JSON.parse(jsonText);
    } catch (e) {
        console.error("Failed to parse JSON from Gemini:", jsonText);
        throw new Error("图像分析API的响应无效。");
    }
};


export const transformImage = async (base64Image: string, mimeType: string, country: string): Promise<string> => {
    const prompt = `你是一位专注于文化变装的专家级数字艺术家。请使用用户提供的肖像，将照片中的人物重塑为来自 ${country} 的当地人。

任务: 编辑图像, 为拍摄对象进行一次完整的文化改造。
- 服装: 让他们穿上美丽、地道、传统的 ${country} 服饰。
- 发型: 将他们的发型设计成具有 ${country} 文化特色的样式。
- 背景: 将背景替换为 ${country} 令人惊叹的标志性场景, 例如著名地标或壮丽的自然景观。
- 关键约束: 不要改变照片中人物的面部特征、身份或肤色。他们的脸必须清晰可辨, 与原始照片中的人物一致。
- 输出: 最终图像应为高质量、逼真的作品。不要在图像上添加任何文字或水印。`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: {
            parts: [
                { inlineData: { data: base64Image, mimeType: mimeType } },
                { text: prompt }
            ]
        },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
    }

    throw new Error("API未能生成图像。");
};