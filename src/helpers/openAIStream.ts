import { OpenAIPayload } from "@/interfaces/OpenAIPayload";
import {createParser, ParsedEvent, ReconnectInterval} from 'eventsource-parser'

export async function OpenAIStream(payload:OpenAIPayload){
    try{
        const encoder= new TextEncoder();
        const decoder= new TextDecoder();

        let counter=0;

        const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY ?? ""}`
        },
        body: JSON.stringify(payload)

    })

    const stream = new ReadableStream({ 
        async start(controller) {
            function onParse(event:ParsedEvent| ReconnectInterval){
                if(event.type==="event"){
                    const {data}= event;
                    if(data==='[DONE]'){
                        controller.close();
                        return;
                    }
                    try{
                        const parsedData=JSON.parse(data);
                        const text= parsedData.choices[0].delta?.content||"";
                        if (counter < 2 && (text.match(/\n/) || []).length) {
                            return;
                          }

                          const queue= encoder.encode(text);
                          controller.enqueue(queue);
                          counter++;
                    }catch(err:any){
                        controller.error(err.message)
                    }
                }
            }
            const parser= createParser(onParse);
            for await(const chunk of res.body as any){
                parser.feed(decoder.decode(chunk))
            }
        }
    })

    return stream;
    }catch(err:any){
        throw new Error(err.message)
    }
}