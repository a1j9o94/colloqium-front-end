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

export const API_URL = import.meta.env.VITE_API_URL;

export const interaction_types = ['text_message', 'phone_call'];