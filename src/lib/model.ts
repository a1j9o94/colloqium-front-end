export interface Recipient {
    id: string;
    recipient_name: string;
    recipient_information: string;
    recipient_phone_number: string;
    recipient_profile: string;
    recipient_engagement_history: string;
    interactions: Interaction[];
    audiences: Audience[];
}

export interface Interaction {
    id: string;
    twilio_conversation_sid: string;
    conversation: string;
    interaction_type: string;
    interaction_goal: string;
    recipient: Recipient;
    sender: Sender;
    campaign: Campaign;
    recipient_outreach_schedule: string;
    interaction_status: string;
    time_created: Date;
    time_updated: Date;
    goal_achieved: boolean;
    rating_explanation: string;
    rating: number;
    campaign_relevance_score: number;
    campaign_relevance_explanation: string;
    campaign_relevance_summary: string;
    insights_about_issues: string;
    insights_about_recipient: string;
}

export interface Sender {
    id: string;
    sender_name: string;
    sender_information: string;
    sender_schedule: string;
    interactions: Interaction[];
    phone_numbers: string[];  // if PhoneNumber has more properties, create an interface for it.
}

export interface Audience {
    id: string;
    audience_name: string;
    audience_information: string;
    sender: Sender;
    recipients: Recipient[];
    campaigns: Campaign[];
}

export interface Campaign {
    id: string;
    campaign_name: string;
    campaign_prompt: string;
    campaign_goal: string;
    campaign_fallback: string;
    example_interactions: string;
    sender: Sender;
    campaign_end_date: Date;
    campaign_manager_summary: string;
    communications_director_summary: string;
    field_director_summary: string;
    interactions_sent: number;
    interactions_delivered: number;
    interactions_responded: number;
    interactions_converted: number;
    interactions: Interaction[];
    audiences: Audience[];
}