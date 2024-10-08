import React, { useEffect, useState } from 'react';
import InputMask from 'react-input-mask';
import { motion } from 'framer-motion';
import emailjs from 'emailjs-com';
import { useDataContext } from '../utils/DataContext';

function ContactPage() {
    const { exec } = useDataContext();
    const [phone, setPhone] = useState<string>('');
    const [result, setResult] = useState<string>('');
    const [presidentEmail, setPresidentEmail] = useState<string>('');
    const [vicePresidentEmail, setVicePresidentEmail] = useState<string>('');
    const [rushChairEmail, setRushChairEmail] = useState<string>('');
    const [philoChairEmail, setPhiloChairEmail] = useState<string>('');
    const [selectedReason, setSelectedReason] = useState<string>('');


    useEffect(() => {
        if (exec && exec.length > 0) {
            const president = exec.find(member => member.position === 'President');
            const vicePresident = exec.find(member => member.position === 'Vice President');
            const rushChair = exec.find(member => member.position === 'Recruitment Chair');
            const philoChair = exec.find(member => member.position === 'Philanthropy Chair');
            if (president) setPresidentEmail(president.email ?? '');
            if (vicePresident) setVicePresidentEmail(vicePresident.email ?? '');
            if (rushChair) setRushChairEmail(rushChair.email ?? '');
            if (philoChair) setPhiloChairEmail(philoChair.email ?? '');
        }
    }, [exec]);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(e.target.value);
    };

    const handleReasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedReason(e.target.value);
    };

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setResult("Sending...");

        const serviceID = 'service_fto2w6n'; 
        const templateID = 'template_fpor0bm'; 
        const userID = 'Z7RWu-QLsuqQbgV0H'; 

        // Creating a JavaScript object from form data
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        const formObject: Record<string, any> = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });

        const emailRecipients = [
            'csmatoea@gmail.com', 
            presidentEmail, 
            vicePresidentEmail
        ];
    
        if (selectedReason === 'Rush and Recruitment') {
            emailRecipients.push(rushChairEmail);
        } else if (selectedReason === 'Philanthropy') {
            emailRecipients.push(philoChairEmail);
        }


        formObject['to_email'] = emailRecipients.filter(email => email).join(',');

        emailjs.send(serviceID, templateID, formObject, userID)
            .then((response:any) => {
                console.log('SUCCESS!', response.status, response.text);
                setResult("Form Submitted Successfully");
                form.reset();
                setPhone('');
            }, (error:any) => {
                console.log('FAILED...', error);
                setResult("Failed to send form");
            });
    };

    return (
        <div className="overflow-hidden">
            <div className="w-screen h-[40vh] mb-20 bg-contact md:bg-cover xl:bg-bottom bg-fixed flex justify-center items-center overflow-hidden">
                <div className="bg-azure bg-opacity-50 py-16 px-9 scale-75 md:scale-100 lg:scale-125 xl:scale-150 text-center">
                    <div className="text-white text-4xl font-bold leading-9">Contact Us</div>
                </div>
            </div>
            <motion.div initial={{ rotate: '180deg', scale: 0 }} animate={{ rotate: '0deg', scale: 1 }} transition={{ duration: 1, ease: 'backInOut' }} className="flex flex-col justify-center items-center mt-20 px-3 overflow-hidden">
                <form onSubmit={onSubmit} className="bg-azure p-6 rounded-3xl shadow-lg w-full max-w-2xl mb-20">
                    <h2 className="text-4xl font-bold mb-4 text-center text-white">Have Some Questions?</h2>
                    <div className="mb-4">
                        <label className="block text-white text-xl">Full Name</label>
                        <input
                            name="name"
                            placeholder="Enter your full name"
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded-full mt-1"
                            required
                        />
                    </div>
                    <div className="flex flex-col md:flex-row justify-between gap-0 md:gap-6">
                        <div className="w-full mb-4">
                            <label className="block text-white text-xl">Email</label>
                            <input
                                name="email"
                                placeholder="Enter your email"
                                type="email"
                                className="w-full p-3 border border-gray-300 rounded-full mt-1"
                                required
                            />
                        </div>
                        <div className="w-full mb-4">
                            <label className="block text-white text-xl">Phone Number</label>
                            <InputMask
                                name="phone"
                                mask="999-999-9999"
                                value={phone}
                                onChange={handlePhoneChange}
                                placeholder="Enter your phone number"
                                className="w-full p-3 border border-gray-300 rounded-full mt-1"
                            />
                        </div>
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-white text-xl">How Can We Help You?</label>
                        <select
                            name="reason"
                            value={selectedReason}
                            onChange={handleReasonChange}
                            className="w-full p-3 border border-gray-300 rounded-full mt-1 bg-white"
                            required
                        >
                            <option value="" disabled selected>Select a reason</option>
                            <option value="Rush and Recruitment">Rush and Recruitment</option>
                            <option value="Philanthropy">Philanthropy</option>
                            <option value="Alumni">Alumni</option>
                            <option value="PR">PR</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-white text-xl">Let Us Know What's on Your Mind.</label>
                        <textarea
                            name="message"
                            placeholder="Enter your message"
                            className="w-full p-3 border border-gray-300 rounded-3xl mt-1"
                            required
                        />
                    </div>
                    <div className="text-center">
                        <button
                            type="submit"
                            className="py-2 px-4 text-xl font-semibold bg-old-gold text-black rounded-full hover:bg-dark-gold transition duration-300 hover:text-neutral-700"
                        >
                            Submit
                        </button>
                    </div>
                </form>
                <span className="text-black text-xl">{result}</span>
            </motion.div>
        </div>
    );
}

export default ContactPage;
