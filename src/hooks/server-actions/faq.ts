'use server';

import API_BASES from "../../../apiConfig";

export async function chatBotApi(chat: { question: string }) {
  console.log(chat, 'chatBotApi');

  try {
    const response = await fetch(API_BASES.chatBotAPI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(chat),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data, 'data chatBotApi');
    return { success: true, data };
  } catch (error: any) {
    console.error('Retention strategy error:', error, error.message);
    return { success: false, error: error.message };
  }
}
