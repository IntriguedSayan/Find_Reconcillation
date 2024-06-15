import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface RequestBody{
    email?:string;
    phoneNumber?:string;
}

interface Request{
    body:RequestBody;
}

interface Response{
    status:Function;
    json:Function;
}


const indentifyController =async (req:Request,res:Response) =>{

    let {email, phoneNumber}:RequestBody = req.body;
    phoneNumber = phoneNumber?.toString();
    if( !email  && !phoneNumber){
        return res.status(400).json({message:"Email or phoneNumber is required"});
    }

    try{
        let contacts
        if(email != null && phoneNumber != null){

            contacts = await prisma.contact.findMany({where:{OR:[{email:email || undefined},{phoneNumber:phoneNumber || undefined}]}});
        }
        else if(phoneNumber == null){
            contacts = await prisma.contact.findMany({where:{OR:[{email:email || undefined}]}});
        }else{
            contacts = contacts = await prisma.contact.findMany({where:{OR:[{phoneNumber:phoneNumber || undefined}]}});
        }

        if(contacts.length === 0){
            const newContact = await prisma.contact.create({data:{email,phoneNumber,linkPrecedence: "primary"}});
           return res.status(200).json({contact:{
            primaryContactId: newContact.id,
            emails: email ? [email] : [],
            phoneNumbers: phoneNumber ? [phoneNumber] : [],
            secondaryContactIds: []
           }}) 

        }

        let primaryContact = contacts.find(contact => contact.linkPrecedence === "primary");
        if(!primaryContact){
            primaryContact = contacts[0];
            await prisma.contact.update({where:{id:primaryContact.id},data:{linkPrecedence:"primary"}});
        }
        const secondaryContacts = contacts.filter(contact => contact.id !== primaryContact.id);

        if(!contacts.some(contact => contact.email === email &&  contact.phoneNumber === phoneNumber)){
            const newSecondaryContact = await prisma.contact.create({
                data:{
                    email,
                    phoneNumber,
                    linkedId:primaryContact.id,
                    linkPrecedence:"secondary"
                }
            });
            secondaryContacts.push(newSecondaryContact);
        }

        res.status(200).json({
            contact:{
                primaryContactId: primaryContact.id,
                emails: Array.from(new Set([primaryContact.email, ...secondaryContacts.map(contact => contact.email)].filter(Boolean))),
                phoneNumbers: Array.from(new Set([primaryContact.phoneNumber, ...secondaryContacts.map(contact => contact.phoneNumber)].filter(Boolean))),
                secondaryContactIds: secondaryContacts.map(contact => contact.id)
            }
        })

    }catch(err:any){
        console.log(err);
        res.status(500).json({error:"internal server error", err:err.message});

    }

}

export {indentifyController};