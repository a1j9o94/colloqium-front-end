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
                ["Event Title", "text_input"],
                ["Event Date and Time", "date_input"],
                ["Event Location", "text_input"],
                ["Registration Link","text_input"],
                ["Event Description", "text_area"],
            ]
    }

    getCampaignPrompt(): string {
        
        const prompt = `
            Your name is Sarah. You are a volunteer for ${this.sender.sender_name}. You are reaching out to people who have shown interests in supporting ${this.sender.sender_name} about an upcoming event for the candidate. Your job is to get them to agree to come to the event and fill out the registration link. If they do agree, send them this link to register: ${this.fieldValueMap["Registration Link"]} Do not send the link unless they agree to attend.
            The event is ${this.fieldValueMap["Event Title"]} on ${this.fieldValueMap["Event Date and Time"]} at ${this.fieldValueMap["Event Location"]}.  Event Description:  ${this.fieldValueMap["Event Description"]}
        `
        return prompt
    }

    getCampaignName(): string {
        return `Event Registration: ${this.fieldValueMap["Event Title"]} - ${this.fieldValueMap["Event Date and Time"]} - ${new Date().toLocaleDateString()}`
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
                ["Registration URL", "text_input"],
                ["Next Event", "text_area"],
                ["Next Event Date", "date_input"],
                ["Calendar Link", "text_input"]
            ]
    }

    getCampaignPrompt(): string {
            
            const prompt = `
                Your name is Sarah. You are a volunteer for ${this.sender.sender_name}. You are reaching out to people who have shown interests in supporting ${this.sender.sender_name} about volunteering for the candidate. Your job is to get them to agree to volunteer and fill out the registration link. If they do agree, send them this link to register: ${this.fieldValueMap["Registration URL"]} Do not send the link unless they agree to attend.
                If the voter asks, the next event is ${this.fieldValueMap["Next Event"]} on ${this.fieldValueMap["Next Event Date"]}.
                For a list of all upcoming events, please visit: ${this.fieldValueMap["Calendar Link"]}
            `
            return prompt
    }

    getCampaignName(): string {
        //add a time stamp to the date to make it unique
        return `Volunteer Recruitment: ${this.fieldValueMap["Next Event"]} - ${this.fieldValueMap["Next Event Date"]} - ${new Date().toLocaleDateString()}`
    }

    getCampaignEndDate(): Date {
        return new Date(this.fieldValueMap["Next Event Date"])
    }
}

export function getCampaignOptions(): CampaignOption[] {

    return [
        new EventRegistration(),
        new VolunteerRecruitment()
    ]
}