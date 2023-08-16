export interface Voter {
    id: string;
    voter_name: string;
    voter_phone_number: string;
    voter_profile: VoterProfile;
    voter_engagement_history: string;
    interactions: Interaction[];
    audiences: Audience[];
}

export interface VoterProfile {
    id: string;
    voter: Voter;
    interests: string;
    policy_preferences: string;
    preferred_contact_method: string;
}

export interface Interaction {
    id: string;
    twilio_conversation_sid: string;
    conversation: [];
    interaction_type: string;
    interaction_goal: string;
    voter: Voter;
    sender: Sender;
    campaign: Campaign;
    voter_outreach_schedule: string;
    interaction_status: number;
    time_created: Date;
    time_updated: Date;
    goal_achieved: boolean;
    rating_explanation: string;
    rating: number;
    campaign_relevance_score: number;
    campaign_relevance_explanation: string;
    campaign_relevance_summary: string;
    insights_about_issues: string;
    insights_about_voter: string;
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
    voters: Voter[];
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
    policy_insights: object;
}