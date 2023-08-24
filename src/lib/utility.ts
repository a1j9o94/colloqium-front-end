export function formatDate(date: Date): string {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) {
    month = '0' + month;
  }
  if (day.length < 2) {
    day = '0' + day;
  }

  return [year, month, day].join('-');
}

export function formatPhoneNumber(phoneNumber: string): string {
  // Remove all non-digit characters
  const digits = phoneNumber.replace(/\D/g, '');

  if (digits.length === 10) {
      return '+1' + digits;
  } else if (digits.length === 11) {
      return '+' + digits;
  } else {
      return phoneNumber;
  }
}

// Modify the function to accept an event object
export async function refreshSingleEvaluation(campaign_id: string, interaction_id: string) {
  const res = await fetch(`${API_URL}/campaign/insights`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
          campaign_id: campaign_id,
          interaction_id: interaction_id,
          refresh_interaction_evaluations: true })
  });
  const data = await res.json();
  console.log(data);
}

export const API_URL = import.meta.env.VITE_API_URL ?? process.env.VITE_API_URL;

export const interaction_types = ['text_message', 'phone_call'];