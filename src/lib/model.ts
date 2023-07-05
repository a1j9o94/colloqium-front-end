//define a type for an interacttion it should be an object that 

/*
{
    "campaign_id": 2,
    "recipient_id": 1,
    "interaction_type": "text_message"
}
*/

export interface Interaction {
    id: string;
    campaign: Campaign;
    recipient: Recipient;
    interaction_type: string;
    interaction_status: string;
}


/*
{
    "sender_name": "TestSender",
    "sender_information": "This is a test sender",
    "phone_numbers": ["+16174335929"]
}

*/

export interface Sender {
    sender_name: string;
    id: string;
    sender_information: string;
    phone_numbers: string[];
}

/*
 {
    "sender_id": 1,
    "campaign_name": "2023 Houston Mayoral Race - Volunteer Recruitment",
    "campaign_information": "Your name is Sarah. You are a volunteer for John Whitmire's Mayoral race. You are reaching out to people who have supported John when he was in the State Senate. Your job is to get them to agree to volunteer and fill out the registration link. If they do agree, send them this link to register: https://forms.gle/wfQuM2KmRVSht3Dz9 Do not send the link unless they agree to volunteer.Be brief. Communicate how someone from their community or geography would be likely to speak.",
    "campaign_end_date": "2023-11-07"
}
*/

export interface Campaign {
    id: string;
    campaign_name: string;
    campaign_information: string;
    sender: Sender;
    campaign_end_date: Date;
}

/*
{
    "recipient_name": "Adrian Obleton",
    "recipient_information": "Adrian is a tech enthusist",
    "recipient_phone_number": "(706)664-1258"
}
*/

export interface Recipient {
    id: string;
    recipient_name: string;
    recipient_information: string;
    recipient_phone_number: string;
}