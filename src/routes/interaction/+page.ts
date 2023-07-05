import type { PageLoad } from './$types';
import type { Interaction, Sender, Recipient, Campaign } from '$lib/model';

export const load = (async () => {

    const sender1: Sender = {
        sender_name: 'John Whitmire',
        id: '1',
        sender_information: 'Strong leadership and commitment to public service defines John Whitmire. He has spent his adult life working for Houstonians in our state’s Capitol, and now, John is running for Houston Mayor. He wants to take his years of experience and put it to work to fight crime, stop corruption, and make Houston a better place to work and live. John has represented a large portion of Houston and Harris County in Austin focusing on improving public safety, economic development, and ensuring government works for the people - not special interests. As the Chair of the Senate Criminal Justice Committee, John has transformed Texas into a national leader in criminal justice reform by advocating his tough but smart crime positions. Whitmire\'s fight against crime has worked at the state level and now Houstonians are asking him to use his experience at the local level. John is known as a “can do” public servant. John often says Houston is not New York or Chicago – we are Houston. We can fix our problems. John is an active advocate for all our first responders, and John believes we must have the best fire and police departments in the country. Furthermore, John also advocates for small businesses in Houston and across Texas by championing policies that encourage economic growth. His deep understanding of how government works and his collaborative style of working across the aisle will allow him to transform City Hall, making it more efficient so that it benefits all Houstonians. Houston is a large metropolitan city and John believes we should continue to grow and respect our differences. Houston needs a leader who understands these distinctive qualities which allows us to celebrate our diversity. John Whitmire is the leader we need, and he needs your support in his run for the next Mayor of Houston. Let’s go to work!',
        phone_numbers: ['+16174335929'] 
    }

    const sender2: Sender = {
        sender_name: 'GOTV for All',
        id: '2',
        sender_information: 'GOTV for all is a non partisan organization that is dedicated to getting out the vote for all people.',
        phone_numbers: ['+17069039048']
    }

    /*
        {
            "recipient_name": "Adrian Obleton",
            "recipient_information": "Adrian is a tech enthusist",
            "recipient_phone_number": "(706)664-1258"
        }
    */
    
    const recipient1: Recipient = {
        id: '1',
        recipient_name: 'Adrian Obleton',
        recipient_information: 'Adrian is a tech enthusist',
        recipient_phone_number: '(706)664-1258'
    }

    const campaign1: Campaign = {
        id: '1',
        campaign_name: '2023 Houston Mayoral Race - Volunteer Recruitment',
        campaign_information: 'Your name is Sarah. You are a volunteer for John Whitmire\'s Mayoral race. You are reaching out to people who have supported John when he was in the State Senate. Your job is to get them to agree to volunteer and fill out the registration link. If they do agree, send them this link to register: https://forms.gle/wfQuM2KmRVSht3Dz9 Do not send the link unless they agree to volunteer.Be brief. Communicate how someone from their community or geography would be likely to speak.',
        sender: sender1,
        campaign_end_date: new Date('2023-11-07')
    }

    const campaign2: Campaign = {
        id: '3',
        campaign_name: 'GOTV for All',
        campaign_information: 'Your goal is to get the recipient to register to vote. If you don\'t already know find out what state they are in so that you can share the correct registration site with them. Be brief and friendly in your communications. Mirror back their texting style and try to build rapport.',
        sender: sender2,
        campaign_end_date: new Date('2023-11-07')
    }


    const fetchSenders = async () => {
        
        return [sender1, sender2]
    };

    const fetchInteractions = async () => {
        const interaction1: Interaction = {
            id: '1',
            campaign: campaign1,
            recipient: recipient1,
            interaction_type: 'text_message',
            interaction_status: 'initialized'
        }

        const interaction2: Interaction = {
            id: '2',
            campaign: campaign2,
            recipient: recipient1,
            interaction_type: 'text_message',
            interaction_status: 'initialized'
        }

        return [interaction1, interaction2]
    }

    const fetchCampaigns = async () => {
        return [campaign1, campaign2]
    }

    const fetchInteractionTypes = async () => {
        return ['text_message', 'phone_call']
    }
    
    return {
        senders: await fetchSenders(),
        interactions: await fetchInteractions(),
        campaigns: await fetchCampaigns(),
        interaction_types: await fetchInteractionTypes(),
    };
}) satisfies PageLoad;