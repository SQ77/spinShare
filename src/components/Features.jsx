import { Accordion, AccordionHeader, AccordionBody } from "@material-tailwind/react";
import { FaChevronUp } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import { useState } from "react";
   
const Features = () => {
    const [openAcc1, setOpenAcc1] = useState(true);
    const [openAcc2, setOpenAcc2] = useState(true);
    const [openAcc3, setOpenAcc3] = useState(true);

    const handleOpenAcc1 = () => setOpenAcc1((cur) => !cur);
    const handleOpenAcc2 = () => setOpenAcc2((cur) => !cur);
    const handleOpenAcc3 = () => setOpenAcc3((cur) => !cur);

    return (
        <div className="container mx-6 md:mx-10 mt-10 mb-4">
            <h2 className="text-3xl font-bold mb-2 md:text-center">Features</h2>
            <Accordion open={openAcc1} icon={openAcc1 ? <FaChevronUp /> : <FaChevronDown />} className="w-4/5">
                <AccordionHeader onClick={handleOpenAcc1} className="text-2xl">Create, Edit, Delete</AccordionHeader>
                <AccordionBody className="text-xl text-black">
                Let your friends know your plans by adding spin classes to your schedule.
                </AccordionBody>
            </Accordion>
            <Accordion open={openAcc2} icon={openAcc2 ? <FaChevronUp /> : <FaChevronDown />} className="w-4/5">
                <AccordionHeader onClick={handleOpenAcc2} className="text-2xl">Add Friends</AccordionHeader>
                <AccordionBody className="text-xl text-black">
                Send and manage friend requests. Friends will be able to see each other's schedule.
                </AccordionBody>
            </Accordion>
            <Accordion open={openAcc3} icon={openAcc3 ? <FaChevronUp /> : <FaChevronDown />} className="w-4/5"> 
                <AccordionHeader onClick={handleOpenAcc3} className="text-2xl">Absolute & Ally Schedules</AccordionHeader>
                <AccordionBody className="text-xl text-black">
                Access the schedule of upcoming classes at Absolute & Ally and easily add them to your own schedule.
                </AccordionBody>
            </Accordion>
        </div>
    );
}

export default Features;