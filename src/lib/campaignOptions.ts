import type { Sender } from "./model"

export class CampaignOption {

    sender: Sender = {} as Sender
    label = ""
    fields: [string, string][]= []
    fieldValueMap: { [key: string]: string } = {}
    campaign_name = ""
    campaign_goal = ""
    campaign_end_date: Date = new Date()

    prepareCampaign(sender: Sender, fieldValues: { [key: string]: string }): void {
        this.sender = sender
        //loop through field values and print log them in the console
        this.fieldValueMap = fieldValues
    }

    getCampaignPrompt(): string {
       return `Hi, this is ${this.sender.sender_name} with ${this.sender.sender_information}`
    }

    getCampaignName(): string {
        return this.campaign_name
    }

    getCampaignGoal(): string {
        return this.campaign_goal
    }

    getCampaignEndDate(): Date {
        return this.campaign_end_date
    }
}

class EventRegistration extends CampaignOption {
    
    constructor() {
            super()
            this.label =  "Event Registration"
            this.campaign_goal = "Get the voter to agree to register for the event"
            this.fields = [
                ["Agent Name", "text_input"],
                ["Event Title", "text_input"],
                ["Event Date", "date_input"],
                ["Event Time", "time_input"],
                ["Event Location", "text_input"],
                ["Registration Link","text_input"],
                ["Event Description", "text_area"],
            ]
    }

    getCampaignPrompt(): string {
        
        const prompt = `
            Your name is ${this.fieldValueMap["Agent Name"]}. You are a volunteer for ${this.sender.sender_name}. You are reaching out to people who have shown interests in supporting ${this.sender.sender_name} about an upcoming event for the candidate. Your job is to get them to agree to come to the event and fill out the registration link. If they do agree, send them this link to register: ${this.fieldValueMap["Registration Link"]} Do not send the link unless they agree to attend.
            The event is ${this.fieldValueMap["Event Title"]} on ${this.fieldValueMap["Event Date"]} ${this.fieldValueMap["Event Time"]} at ${this.fieldValueMap["Event Location"]}.  Event Description:  ${this.fieldValueMap["Event Description"]}
        `
        return prompt
    }

    getCampaignName(): string {
        return `Event Registration: ${this.fieldValueMap["Event Title"]}`
    }

    getCampaignEndDate(): Date {
        return new Date(this.fieldValueMap["Event Date and Time"])
    }
}

class VolunteerRecruitment extends CampaignOption {
    
    constructor() {
            super()
            this.label =  "Volunteer Recruitment"
            this.campaign_goal = "Get the voter to agree to volunteer for the candidate and go to the registration link"
            this.fields = [
                ["Agent Name", "text_input"],
                ["Campaign Name", "text_input"],
                ["Registration URL", "text_input"],
                ["Next Event", "text_area"],
                ["Next Event Date", "date_input"],
                ["Next Event Time", "time_input"],
                ["Calendar Link", "text_input"]
            ]
    }

    getCampaignPrompt(): string {
            
            const prompt = `
                Your name is ${this.fieldValueMap["Agent Name"]}. You are a volunteer for ${this.sender.sender_name}. You are reaching out to people who have shown interests in supporting ${this.sender.sender_name} about volunteering for the candidate. Your job is to get them to agree to volunteer and fill out the registration link. If they do agree, send them this link to register: ${this.fieldValueMap["Registration URL"]} Do not send the link unless they agree to attend.
                If the voter asks, the next event is ${this.fieldValueMap["Next Event"]} on ${this.fieldValueMap["Next Event Date"]}.
                For a list of all upcoming events, please visit: ${this.fieldValueMap["Calendar Link"]}
            `
            return prompt
    }

    getCampaignName(): string {
        //add a time stamp to the date to make it unique
        return `Volunteer Recruitment: ${this.fieldValueMap["Campaign Name"]}`
    }

    getCampaignEndDate(): Date {
        return new Date(this.fieldValueMap["Next Event Date"])
    }
}

class Persuasion extends CampaignOption {
        
    constructor() {
            super()
            this.label =  "Persuasion"
            this.campaign_goal = "Learn what issues are important to the voter and get them to agree to support the candidate"
            this.fields = [
                ["Agent Name", "text_input"],
                ["Campaign Name", "text_input"],
                ["Campaign End Date", "date_input"],
                ["Registration URL", "text_input"],
            ]
    }

    getCampaignPrompt(): string {
            
            const prompt = `
                Your name is ${this.fieldValueMap["Agent Name"]}. You are a volunteer for ${this.sender.sender_name}. You are reaching out to people who live in the district about supporting ${this.sender.sender_name}. Your job is to get them to agree to support the candidate.
                Begin by introducing yourself and asking if the voter is aware of the upcoming race ending on ${this.fieldValueMap["Campaign End Date"]}. If they are not aware, explain that there is an upcoming election. Once you know they are aware, ask them about what issues are important to them. Once you understand what issues matter, convince them that ${this.sender.sender_name} is the best candidate to address those issues. If they agree, send them this link to make a donation or volunteer: ${this.fieldValueMap["Registration URL"]} Do not send the link unless they agree to support the candidate.
            `
            return prompt
    }

    getCampaignName(): string {
        //add a time stamp to the date to make it unique
        return `Persuasion: ${this.fieldValueMap["Campaign Name"]}`
    }

    getCampaignEndDate(): Date {
        return new Date(this.fieldValueMap["Campaign End Date"])
    }
}

class EarlyVoting extends CampaignOption {
    
    constructor() {
        super()
        this.label =  "Early Voting"
        this.campaign_goal = "Get the voter to agree to vote early"
        this.fields = [
            ["Agent Name", "text_input"],
            ["Campaign Name", "text_input"],
            ["Early Voting Deadline", "date_input"],
            ["Campaign End Date", "date_input"],
        ]
    }

    getCampaignPrompt(): string {
                
        const prompt = `
            Your name is ${this.fieldValueMap["Agent Name"]}. You are a volunteer for ${this.sender.sender_name}. You are reaching out to people who live in the district about voting early for ${this.sender.sender_name}. Your job is to get them to agree to vote early.
            Begin by introducing yourself and asking if the voter is aware of the upcoming race ending on ${this.fieldValueMap["Campaign End Date"]}. If they are not aware, explain that there is an upcoming election. Once you know they are aware, ask them if they are aware of early voting. If they are not aware, explain that they can vote early. Once you know they are aware, ask them if they are planning to vote early. If they are not planning to vote early, convince them that voting early is the best option.
        `
        return prompt
    }

    getCampaignName(): string {
        return `Early Voting: ${this.fieldValueMap["Campaign Name"]}`
    }

    getCampaignEndDate(): Date {
        return new Date(this.fieldValueMap["Early Voting Deadline"])
    }
}

class CandidateIntroduction extends CampaignOption {
    constructor() {
        super()
        this.label =  "Candidate Introduction"
        this.campaign_goal = "Introduce the candidate to the voter. Find out what issues are important to the voter"
        this.fields = [
            ["Agent Name", "text_input"],
            ["Campaign Name", "text_input"],
            ["Today's Date", "date_input"],
            ["Election Date", "date_input"],
            ["Candidate Website", "text_input"],
            ["Additional Context", "text_area"]
        ]
    }

    getCampaignPrompt(): string {
        const prompt = `
            Your name is ${this.fieldValueMap["Agent Name"]}. You are a volunteer for ${this.sender.sender_name}. You are reaching out to people who live in the district about supporting ${this.sender.sender_name}. Your job is to introduce the candidate and find out what issues are important to the voter.
            The election is on ${this.fieldValueMap["Election Date"]}. Today is ${this.fieldValueMap["Today's Date"]}. The candidate's website is ${this.fieldValueMap["Candidate Website"]}.

            ${this.fieldValueMap["Additional Context"]}
        `
        return prompt
    }

    getCampaignName(): string {
        return `Candidate Introduction: ${this.fieldValueMap["Campaign Name"]}`
    }

    getCampaignEndDate(): Date {
        return new Date(this.fieldValueMap["Election Date"])
    }

}

class VoterRegistration extends CampaignOption {
    constructor() {
        super()
        this.label =  "Voter Registration"
        this.campaign_goal = "Get the voter to go to the registration link and register to vote"
        this.fields = [
            ["Campaign Name", "text_input"],
            ["Agent Name", "text_input"],
            ["Registration URL", "text_input"],
            ["Next Election", "text_input"],
            ["Next Election Date", "date_input"]
        ]
    }

    getCampaignPrompt(): string {
        const prompt = `
            Your name is ${this.fieldValueMap["Agent Name"]}. You are a volunteer for ${this.sender.sender_name}. You are reaching out to people who live in the district about registering to vote. Your job is to get them to agree to register to vote.
            Begin by introducing yourself and asking if the voter is registered to vote. If they are not registered to vote, convince them that registering to vote is the best option.
            If they agree, send them this link to register: ${this.fieldValueMap["Registration URL"]} Do not send the link unless they agree to register.

            The next election is ${this.fieldValueMap["Next Election"]} on ${this.fieldValueMap["Next Election Date"]}.
        `
        return prompt
    }

    getCampaignName(): string {
        //add a time stamp to the date to make it unique
        return `Voter Registration: ${this.fieldValueMap["Campaign Name"]}`
    }

    getCampaignEndDate(): Date {
        return new Date(this.fieldValueMap["Next Event Date"])
    }
}

class LeadGenerationMeeting extends CampaignOption {
    constructor() {
        super()
        this.label =  "Lead Generation Meeting"
        this.campaign_goal = "Get the lead to agree to meet with the candidate organization"
        this.fields = [
            ["Agent Name", "text_input"],
            ["Campaign Name", "text_input"],
            ["Scheduling link", "text_input"],
            ["Additional Context", "text_area"]
        ]
    }

    getCampaignPrompt(): string {
        const prompt = `
            Your name is ${this.fieldValueMap["Agent Name"]}. You are a volunteer for ${this.sender.sender_name}. You are reaching out to people who run other political campaigns. You are doing customer discovery to find out if they are looking for easy ways to reach more voters. Your job is to get them to agree to meet with the candidate organization.
            If they agree, send them this link to schedule a meeting: ${this.fieldValueMap["Scheduling link"]} Do not send the link unless they agree to meet.

            Make sure your first message gives enough context to the reader who has never heard of colloqium before about why they would even want to book a meeting while being mindful to not overwhelm them with too much information.

            ${this.fieldValueMap["Additional Context"]}
        `
        return prompt
    }

    getCampaignName(): string {
        return `Lead Generation Meeting: ${this.fieldValueMap["Campaign Name"]}`
    }

    getCampaignEndDate(): Date {
        return new Date(this.fieldValueMap["Meeting Date"])
    }
}

class Fundraising extends CampaignOption {
    constructor() {
        super()
        this.label =  "Fundraising"
        this.campaign_goal = "Get the voter to agree to donate to the candidate"
        this.fields = [
            ["Agent Name", "text_input"],
            ["Campaign Name", "text_input"],
            ["Election Date", "date_input"],
            ["Donation URL", "text_input"],
            ["Additional Context", "text_area"]
        ]
    }

    getCampaignPrompt(): string {
        const prompt = `
            Your name is ${this.fieldValueMap["Agent Name"]}. You are a volunteer for ${this.sender.sender_name}. You are reaching out to people who live in the district about donating to the candidate. Your job is to get them to agree to donate to the candidate.
            Begin by introducing yourself and asking if the voter is aware of the upcoming election. If they are not aware, explain that there is an upcoming election.

            Before asking for a donation be sure to talk about how Rylan can address issues that are important to the voter. If you don't know any issues, ask.

            Once they agree to donate, send them the donation link: ${this.fieldValueMap["Donation URL"]} Do not send the link unless they agree to donate.

            You have the following additona context for this donation ask: ${this.fieldValueMap["Additional Context"]}
        `
        return prompt
    }

    getCampaignName(): string {
        return `Fundraising: ${this.fieldValueMap["Campaign Name"]}`
    }

    getCampaignEndDate(): Date {
        return new Date(this.fieldValueMap["Election Date"])
    }
}



export function getCampaignOptions(): CampaignOption[] {

    return [
        new EventRegistration(),
        new Fundraising(),
        new VolunteerRecruitment(),
        new Persuasion(),
        new EarlyVoting(),
        new CandidateIntroduction(),
        new VoterRegistration(),
        new LeadGenerationMeeting()
    ]
}